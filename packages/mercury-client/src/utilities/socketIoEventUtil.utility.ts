const socketIoEventUtil = {
    toSocketName(name: string): string {
        return name.replace('.', '__')
    },

    toMercuryName(name: string): string {
        return name.replace('__', '.')
    },
}

export default socketIoEventUtil
