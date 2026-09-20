// helper for building query
export const buildSessionQuery = (req) => {
    const query = { owner: req.user._id };
    const { from, to, type } = req.query;

    if(from || to) {
        query.date = {};
        if(from) query.date.$gte = new Date(from);
        if(to) query.date.$lte = new Date(to);
    }

    if(type && type !== "all") {
        query.type = type;
    }

    return query;
}
