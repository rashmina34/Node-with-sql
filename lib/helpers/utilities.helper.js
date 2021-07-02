const slugify = require('slugify');



exports.Pagination = async (req, next) => {

    const isInteger = val => {
        const intRegex = /^\d+$/;
        return intRegex.test(val.toString());
    };

    try {
        return {
            perPage: req.query.perpage && isInteger(req.query.perpage) ? parseInt(req.query.perpage) : 10,
            page: req.query.page && isInteger(req.query.page) ? parseInt(req.query.page) : 1
        }

    } catch (err) {
        console.log(err, '<<<<<<<utilities helper');
    }

}

exports.slugifyTitle = (title) => {
    return slugify(title, {
        replacement: '-',
        remove: null,
        lower: true
    })
}
