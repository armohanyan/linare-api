module.exports = {
    paginate: ({ currentPage = '1', pageSize = '15' }) => {
        const offset = parseInt((currentPage - 1) * pageSize, 10);
        const limit = parseInt(pageSize, 10);
        return {
            offset,
            limit,
        };
    },

    getLastWeeksDate: () =>  {
        const now = new Date();

        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    },

    getLastMonthDate: () =>  {
        const now = new Date();

        return new Date(now.setDate(1)).getTime()
    },

    getPreviousDay(date = new Date()) {
        const previous = new Date(date.getTime());
        previous.setDate(date.getDate() - 1);

        return new Date(previous).getTime();
    }

}