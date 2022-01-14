import { expect, test } from '@jest/globals';
import checkDateOrder from '../lib/utils/checkDateOrder';

test('checkDateOrder returns true if second date precedes first date', () => {
    const date1 = '2022-01-14';
    const date2 = '2022-01-13';
    expect(checkDateOrder(date1, date2)).toBe(true);
    const date3 = '2022-01-14';
    const date4 = '2022-01-15';
    expect(checkDateOrder(date3, date4)).toBe(false);
});
