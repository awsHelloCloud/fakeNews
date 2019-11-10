const line = require('@line/bot-sdk');
const config = {
	channelAccessToken: '',
	channelSecret: '',
};
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
	const {replyToken, message} = lineEvent
	if (!replyToken || message.type !== 'text') {
		return
	}
	const { text = '' } = message
	const urlMatch = text.match(/(https:\/\/|^http:\/\/)[^ ]*/)
	if (urlMatch) {
		const url = urlMatch[0]
		return client.replyMessage(lineEvent.replyToken, {
			type: 'text',
			text: url
		});
	}
}
