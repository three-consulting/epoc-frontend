const checkDateOrder = (date1?: string, date2?: string): boolean => {
    if (date1) {
        if (date2 && date2 <= date1) {
            return true;
        }
    }
    return false;
};

export default checkDateOrder;
