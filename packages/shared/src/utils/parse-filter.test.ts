import { parseFilter } from '.';
import { Filter } from '../types/filter';

describe('', () => {
	it('returns the filter when passed accountability with only a role', () => {
		const mockFilter = { _and: [{ field: 'field' }] } as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockFilter);
	});

	it('returns the filter includes an _in it parses the filter with a deepMap', () => {
		const mockFilter = {
			_and: [
				{
					status: {
						_in: 'published',
					},
				},
			],
		} as Filter;
		const mockResult = {
			_and: [
				{
					status: {
						_in: ['published'],
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('returns the filter includes an _in it parses the filter with a deepMap', () => {
		const mockFilter = {
			_and: [
				{
					status: {
						_in: 'published,draft',
					},
				},
			],
		} as Filter;
		const mockResult = {
			_and: [
				{
					status: {
						_in: ['published', 'draft'],
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('returns the date', () => {
		const mockFilter = {
			_and: [
				{
					date: {
						_eq: '$NOW',
					},
				},
			],
		} as Filter;
		const mockResult = {
			_and: [
				{
					date: {
						_eq: new Date(),
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('returns the filter includes an _in it parses the filter with a deepMap', () => {
		const mockFilter = {
			_and: [
				{
					status: {
						_in: ['published', 'draft'],
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockFilter);
	});

	it('does proper type casting', () => {
		const mockFilter = {
			_and: [
				{
					status: {
						_eq: 'true',
					},
					field: {
						_eq: 'false',
					},
					field2: {
						_eq: 'null',
					},
				},
			],
		} as Filter;

		const mockResult = {
			_and: [
				{
					status: {
						_eq: true,
					},
					field: {
						_eq: false,
					},
					field2: {
						_eq: null,
					},
				},
			],
		};

		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('replaces the user from accountability to $CURRENT_USER', () => {
		const mockFilter = {
			_and: [
				{
					owner: {
						_eq: '$CURRENT_USER',
					},
				},
			],
		} as Filter;
		const mockResult = {
			_and: [
				{
					owner: {
						_eq: 'user',
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin', user: 'user' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('replaces the role from accountability to $CURRENT_ROLE', () => {
		const mockFilter = {
			_and: [
				{
					owner: {
						_eq: '$CURRENT_ROLE',
					},
				},
			],
		} as Filter;
		const mockResult = {
			_and: [
				{
					owner: {
						_eq: 'admin',
					},
				},
			],
		} as Filter;
		const mockAccountability = { role: 'admin' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});

	it('adjusts the date by 1 day', () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date(1632431505992));

		const mockFilter = {
			date: {
				_eq: '$NOW(-1 day)',
			},
		} as Filter;
		const mockResult = {
			date: {
				_eq: new Date('2021-09-22T21:11:45.992Z'),
			},
		} as Filter;
		const mockAccountability = { role: 'admin', user: 'user' };
		expect(parseFilter(mockFilter, mockAccountability)).toStrictEqual(mockResult);
	});
});