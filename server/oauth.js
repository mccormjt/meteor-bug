function createServiceConfiguration(service, keyName, key, secret) {
  ServiceConfiguration.configurations.remove({ service: service });
  var params = { service: service, secret: secret };
  params[keyName] = key;
  ServiceConfiguration.configurations.insert(params);
}

createServiceConfiguration('facebook', 'appId', '811520488931045', '9fbc1ea1a4040b3631d3b49e4b3202b9');

createServiceConfiguration('twitter', 'consumerKey',  'tjacTyh7ZFFv9kz16BhOAYtNO', 'RoQWI7MQQpwZsRL5CJdFRfIGcRUIWPhptxeVWjOzUmBT7GCIP7');