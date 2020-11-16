const socketIoEventUtil = {
	toSocketName(name: string): string {
		return name.replace('.', '_')
	},

	toMercuryName(name: string): string {
		return name.replace('_', '.')
	},
}

export default socketIoEventUtil
