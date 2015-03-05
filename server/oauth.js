function createServiceConfiguration(service, keyName, key, secret) {
  ServiceConfiguration.configurations.remove({ service: service });
  var params = { service: service, secret: secret };
  params[keyName] = key;
  ServiceConfiguration.configurations.insert(params);
}

createServiceConfiguration('facebook', 'appId', '811520652264362', 'ded48ed31e7c1de81187e317b30b8109');

createServiceConfiguration('twitter', 'consumerKey',  'tjacTyh7ZFFv9kz16BhOAYtNO', 'RoQWI7MQQpwZsRL5CJdFRfIGcRUIWPhptxeVWjOzUmBT7GCIP7');