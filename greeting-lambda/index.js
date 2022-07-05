
const moment=require("moment")
const greetings={
    'en':"Hello",
    "fr":"Bonjour",
    "de":"Guten morgen",
    "hi":"Namaste"
}

exports.handler = async (event) => {
    let name=event.pathParameters.name
    let{lang,...info}=event.queryStringParameters

    const result={
        info,
        timestamp:moment().unix(),
        greeting:`${greetings[lang]?greetings[lang]:greetings["en"]} ${name}`
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify({result}),
        
    };
    return response;
};
