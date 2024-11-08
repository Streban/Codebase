const KafkaPaylaod = require('../apis/models/kafkaconsumer')

const checkKafkaPayloadConsumed = async (eventId)=>{
    console.log(eventId)
    const isPayloadConsumed = await KafkaPaylaod.findOne({eventId})
    if(isPayloadConsumed){
        return true
    }
    return false
}

const saveKafkaConsumerPaylaod = async (payload)=>{
    await KafkaPaylaod.create(payload)
    console.log(`------ payload-saved-event: ${payload.event} payloadId: ${payload.eventId}`)
}

module.exports = {
    checkKafkaPayloadConsumed,
    saveKafkaConsumerPaylaod
}