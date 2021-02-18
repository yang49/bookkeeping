exports.handler = async (event) => {
    const randomInt = Math.floor(Math.random() * Math.floor(10000)).toString();
    let responseCode = 200;
    console.log("Hello World")

    let responseBody = {
        message: `Successfully pushed message ${randomInt}!!`,
        input: event
    };

    return {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
}
