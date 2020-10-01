import fs from 'fs'
import pathUtil from 'path'
import {
	HealthCheckItem,
	ISkillFeature,
	ISkill,
} from '@sprucelabs/spruce-skill-utils'

class SchemaSkillFeature implements ISkillFeature {
	private skill: ISkill

	public constructor(skill: ISkill) {
		this.skill = skill
	}

	public execute = async () => {}

	public checkHealth = async () => {
		const status: HealthCheckItem['status'] = 'passed'
		return {
			status,
		}
	}

	public isInstalled = async () => {
		const schemaPath = pathUtil.join(
			this.skill.rootDir,
			'node_modules',
			'@sprucelabs/schema'
		)

		const isSchemaInstalled = fs.existsSync(schemaPath)

		return isSchemaInstalled
	}
}

export default (skill: ISkill) => {
	const feature = new SchemaSkillFeature(skill)

	skill.registerFeature('schema', feature)
}
