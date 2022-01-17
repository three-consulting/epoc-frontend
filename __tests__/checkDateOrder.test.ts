import { expect, test } from '@jest/globals';
import checkDateOrder from '../lib/utils/checkDateOrder';

describe('checkDateOrder returns true if start date precedes end date', () => {
    test('start date preceding end date should return true', () => {
        const startDate = '2022-01-14';
        const endDate = '2022-01-13';
        expect(checkDateOrder(startDate, endDate)).toBeTruthy();
    });
    test('end date preceding start date should return false', () => {
        const startDate = '2022-01-14';
        const endDate = '2022-01-15';
        expect(checkDateOrder(startDate, endDate)).toBeFalsy();
    });
    test('undefined end date should return false', () => {
        const startDate = '2022-01-14';
        const endDate = undefined;
        expect(checkDateOrder(startDate, endDate)).toBeFalsy();
    });
});
