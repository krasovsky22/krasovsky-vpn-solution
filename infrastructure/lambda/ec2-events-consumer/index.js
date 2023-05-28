const handler = async (event) => {
    event.Records.forEach(record => {
        const { body } = record;
        console.log('aaaa', body);
    })
    return null;
}
exports.handler = handler;
