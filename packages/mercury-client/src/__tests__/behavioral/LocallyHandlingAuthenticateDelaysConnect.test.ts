import { eventResponseUtil } from '@sprucelabs/spruce-event-utils'
import { test, assert } from '@sprucelabs/test-utils'
import { MercuryClientFactory, MercuryTestClient } from '../..'
import AbstractClientTest from '../../tests/AbstractClientTest'

export default class LocallyHandlingAuthenticateDelaysConnectTest extends AbstractClientTest {
    protected static async beforeEach() {
        await super.beforeEach()
        MercuryClientFactory.setIsTestMode(true)
        MercuryTestClient.setShouldRequireLocalListeners(false)
    }

    @test()
    protected static async locallyHandlingAuthenticateDelaysConnect() {
        const { skillClient, skill } = await this.mockAuthAndGetSkillClient()

        //@ts-ignore
        assert.isFalse(skillClient.isConnectedToApi)

        const results = await skillClient.emit('whoami::v2020_12_25')

        //@ts-ignore
        assert.isTrue(skillClient.isConnectedToApi)

        const { auth, type } =
            eventResponseUtil.getFirstResponseOrThrow(results)

        assert.isEqual(type, 'authenticated')
        assert.doesInclude(skill, auth.skill)
    }

    @test()
    protected static async delayedConnectHandlesManyParallelRequests() {
        const { skillClient } = await this.mockAuthAndGetSkillClient()

        //@ts-ignore
        assert.isFalse(skillClient.isConnectedToApi)

        const auth = skillClient.authenticate.bind(skillClient)

        let midAuthResults: any

        skillClient.authenticate = (...args: any[]) => {
            void skillClient
                .emit('whoami::v2020_12_25')
                .then((results) => (midAuthResults = results))

            //@ts-ignore
            return auth(...args)
        }

        const all = await Promise.all([
            skillClient.emit('whoami::v2020_12_25'),
            skillClient.emit('whoami::v2020_12_25'),
            skillClient.emit('whoami::v2020_12_25'),
            skillClient.emit('whoami::v2020_12_25'),
        ])

        while (!midAuthResults) {
            await this.wait(100)
        }

        for (const response of [...all, midAuthResults]) {
            assert.isEqual(response.responses[0].payload?.type, 'authenticated')
        }
    }

    private static async mockAuthAndGetSkillClient() {
        const { client: creatorClient, person } = await this.loginAsDemoPerson()
        const skill = await this.seedDemoSkill(creatorClient)
        const skillClient = await this.connectToApi()

        await creatorClient.on('authenticate::v2020_12_25', async () => {
            return {
                type: 'authenticated' as any,
                auth: {
                    skill: {
                        ...skill,
                        creators: [
                            {
                                personId: person.id,
                            },
                        ],
                    },
                },
            }
        })

        await skillClient.authenticate({
            skillId: skill.id,
            apiKey: skill.apiKey,
        })
        return { skillClient, skill }
    }
}
