module.exports = function(RED) {
    const handleMessage = require('./lib/engine');

    function AzureIotcBridgeNode(config) {
        RED.nodes.createNode(this,config);
        this.registrationHost = config.registrationHost;
        this.sasToken = config.sasToken;
        this.idScope = config.idScope;

        var node = this;

        node.on('input', function(msg) {
            const parameters = {
                idScope: node.idScope,
                sasToken: node.sasToken,
                registrationHost: node.registrationHost
            };
            // take optinally Scope and Key from the msg-Object
            try {
                parameters.idScope = msg.idScope;
                parameters.sasToken = msg.sasToken;
            } catch (e) {
                node.send('[ERROR]', e.message);
            };

            try {
                handleMessage({ ...parameters}, msg.payload.device, msg.payload.measurements, msg.payload.properties, msg.payload.timestamp);
            } catch (e) {
                node.send('[ERROR]', e.message);
            };

        });
    }
    RED.nodes.registerType("azure-iotc-bridge",AzureIotcBridgeNode);
}
