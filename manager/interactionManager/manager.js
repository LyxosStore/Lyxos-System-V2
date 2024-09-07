const interactions = {}

interactButton = function(identifier, interaction) {
    let extraData
    let hasExtraData = identifier.indexOf("::")
    if (hasExtraData !== -1) {
        let beforeSeparator = identifier.substring(0, hasExtraData);
        let afterSeparator = identifier.substring(hasExtraData + 2);

        identifier = beforeSeparator
        extraData = afterSeparator
    }

    if (interactions[identifier]) {
        try {
            interactions[identifier](interaction, extraData)
        } catch (err) {
            console.error(err)
        }
    } else {
        return false
    }
}

addInteraction = function(identifier, func) {
    if (!interactions[identifier]) {
        interactions[identifier] = func

        return true
    }

    return false
}