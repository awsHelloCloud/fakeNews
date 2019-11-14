const fetch = require('node-fetch')
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: '',
    channelSecret: '',
}

const client = new line.Client(config);

exports.handler = async (event) => {

    let body = {}
    try {
        body = JSON.parse(event.body)
    } catch (e) {
    }
    if (body.events) {
        for (const lineEvent of body.events) {
            console.log(body.events)
            await handleLineEvent(lineEvent)
        }
    }
    const response = {
        statusCode: 200,
    }
    return response
}

async function handleLineEvent(lineEvent) {
    //lineEvent = {
    // "type": "message",
    //     "replyToken": "147c2ccac2ac4a67902cf581d23123b6",
    //     "source": {
    //         "userId": "U1d339e010bf7ea858c3db64f6db7bec9",
    //         "type": "user"
    //     },
    //     "timestamp": 1573358747410,
    //     "message": {
    //         "type": "text",
    //         "id": "10891592609439",
    //         "text": "test"
    //     }
    // { type: 'message',
    //    replyToken: '46ffa26ac31f4610bcd54bd171c45589',
    //    source:
    //     { userId: 'Ua39a8e4190f16b94f699aa3e64d5ee13',
    //       groupId: 'C96afc25a4b8077791cb1a87bcf6781a8',
    //       type: 'group' },
    //    timestamp: 1573732438184,
    //    message: { type: 'text', id: '10916399577526', text: '/isFakeNews' } }
    //}
    const {replyToken, message, source, } = lineEvent
    if (!replyToken || message.type !== 'text') {
        return
    }
    const { text = '' } = message
    if (text) {
        const isFakeNewResult = await isFakeNews({
            roomId:source.groupId || source.userId,
            userId: source.userId,
            text: text
        })
        const mapping = {
            'YES': '假的',
            'NO': '真的',
            'UNKNOWN': '無法辨識 要幫忙？https://cofacts.g0v.tw/'
        }
        return client.replyMessage(lineEvent.replyToken, {
            type: 'text',
            text: `${text.substring(0,10)}...${mapping[isFakeNewResult.is_fake] || mapping['UNKNOWN']}`
        });
    }

}


async function isFakeNews({roomId, userId, text}) {
    try {
        const body = {roomId, userId, text}
        console.log(JSON.stringify({body}))
        const url = 'https://ae35ddad.ngrok.io/valid-fakenews'
        const resp = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body),
            timeout: 10000,
        })
        const respBody = await resp.json()
        return respBody
    } catch (e) {
        return {error: e.message}
    }
}
//;(async() => {
//  await isFakeNews({roomdId: 'roomdId001', userId:'userId001', text:'香港很好'})
//})()


