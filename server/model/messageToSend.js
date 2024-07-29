const bind = (row, params, allowEmpty = true) {
    const args = []
    for (let param of params) {

        if (param == "today") {
            args.push(moment().format("YYYY-MM-DD"))
            continue
        }

        let split = param.split("+")
        if (split.length == 2) {
            if (split[0] == "today")
            args.push(moment().add(Number.parseInt(split[1]), "days").format("YYYY-MM-DD"))
            continue
        }  

        split = param.split("-")
        if (split.length == 2) {
            if (split[0] == "today")
            args.push(moment().subtract(Number.parseInt(split[1]), "days").format("YYYY-MM-DD"))
            continue
        }    

        if (row[param]) {
            args.push(row[param])
            continue
        }

        if (param || allowEmpty) args.push(param)
    }
    return args
}

const applyArgs = (template, params, args) {
    if (params) {
        const args = bind(row, params)
        const split = context.localize(template).split("%s"), text = []
        for (let i = 0; i < split.length; i++) {
            text.push(split[i])
            if (i < args.length) text.push(args[i])
        }
        message.text = text.join("")
    }
    else message.text = template    
}

const messageToSend = (context, rows, config) => {

    const dataToInsert = [], dataToUpdate = []
    for (let row of rows) {
        for (let toSend of config.toSend) {
            const message = { channel: toSend.channel }

            if (toSend.object) {
                if (toSend.object.params) {
                    const template = context.localize(toSend.object)
                    const args = bind(row, toSend.object.params)
                    message.object = applyArgs(template, toSend.object.params, args)
                }
                else message.object = context.localize(toSend.object)    
            }

            if (toSend.text) {
                if (toSend.text.params) {
                    const template = context.localize(toSend.text)
                    const args = bind(row, toSend.text.params)
                    message.text = applyArgs(template, toSend.text.params, args)
                }
                else message.text = context.localize(toSend.text)    
            }

            if (toSend.templateId) message.templateId = toSend.templateId

            if (toSend.sender) {
                message.sender = { name: context.localize(toSend.sender) }
                if (toSend.sender.email) message.sender.email = toSend.sender.email
            }

            if (toSend.cc) message.cc = bind(row, toSend.cc)
            
            if (toSend.cci) message.cci = bind(row, toSend.cci)

            dataToInsert.push(message)
        }
    }

    return { dataToInsert: dataToInsert, dataToUpdate: dataToUpdate }
}

module.exports = {
    messageToSend
}