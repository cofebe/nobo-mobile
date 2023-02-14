const date = new Date();
const classes = [{
	  value: date.getFullYear().toString(),
	  label: date.getFullYear().toString(),
	},
	{
	  value: (date.getFullYear() + 1).toString(),
	  label: (date.getFullYear() + 1).toString(),
	},
	{
	  value: (date.getFullYear() + 2).toString(),
	  label: (date.getFullYear() + 2).toString(),
	},
	{
	  value: (date.getFullYear() + 3).toString(),
	  label: (date.getFullYear() + 3).toString(),
	},
	{
	  value: (date.getFullYear() + 4).toString(),
	  label: (date.getFullYear() + 4).toString(),
	},
	{
	  value: (date.getFullYear() + 5).toString(),
	  label: (date.getFullYear() + 5).toString(),
	},
	{
	  value: (date.getFullYear() + 6).toString(),
	  label: (date.getFullYear() + 6).toString(),
	},
	{
	  value: (date.getFullYear() + 7).toString(),
	  label: (date.getFullYear() + 7).toString(),
	},
	{
	  value: (date.getFullYear() + 8).toString(),
	  label: (date.getFullYear() + 8).toString(),
	},
	{
	  value: (date.getFullYear() + 9).toString(),
	  label: (date.getFullYear() + 9).toString(),
	},
	{
	  value: (date.getFullYear() + 10).toString(),
	  label: (date.getFullYear() + 10).toString(),
	},
	{
	  value: (date.getFullYear() + 11).toString(),
	  label: (date.getFullYear() + 11).toString(),
	},
	{
	  value: (date.getFullYear() + 12).toString(),
	  label: (date.getFullYear() + 12).toString(),
	},
	{ value: 'FR', label: 'Freshman' },
	{ value: 'SO', label: 'Sophmore' },
	{ value: 'JR', label: 'Junior' },
	{ value: 'SR', label: 'Senior' },
	{ value: 'JC', label: 'JUCO' },
	{ value: 'PRO', label: 'PRO' },
	{ value: 'Former', label: 'Former' },
	{ value: 'FA', label: 'Free Agent' },
	{ value: 'Retired', label: 'Retired' },
	{ value: 'GRAD', label: 'GRAD' },
	]

export const getClasses = () => classes;