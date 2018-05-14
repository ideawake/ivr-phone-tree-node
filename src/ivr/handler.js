const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();
  // const bodyUrl = 'https://raw.githubusercontent.com/TwilioDevEd/ivr-phone-tree-servlets/master/et-phone.mp3';

  const gather = voiceResponse.gather({
    action: '/ivr/extensions',
    numDigits: '1',
    method: 'POST',
  });

  // gather.play({loop: 3}, bodyUrl);
  gather.say(
    'Idea wakes phone system is currently down or under maintenance.' +
    'Please reach us directly at +1 two six two, three five two, zero nine zero seven.' +
    'You may also press 1 to reach sales, press 2 to reach support, or email us, support at idea wake dot com. Thank you.',
    {voice: 'alice', language: 'en-GB', loop: 3}
  );

  return voiceResponse.toString();
};

exports.menu = function menu(digit) {
  const optionActions = {
    '1': giveInformation,
    '2': listExtensions,
  };

  return (optionActions[digit])
    ? optionActions[digit]()
    : redirectWelcome();
};

exports.extensions = function extensions(digit) {
  const optionActions = {
    '1': '+12623520907',
    '2': '+14143132945',
  };

  if (optionActions[digit]) {
    const twiml = new VoiceResponse();
    twiml.dial(optionActions[digit]);
    return twiml.toString();
  }

  return redirectWelcome();
};

// exports.planets = function planets(digit) {
//   const optionActions = {
//     '1': '+12623520907',
//     '2': '+14143132945',
//   };

//   if (optionActions[digit]) {
//     const twiml = new VoiceResponse();
//     twiml.dial(optionActions[digit]);
//     return twiml.toString();
//   }

//   return redirectWelcome();
// };

/**
 * Returns Twiml
 * @return {String}
 */
function giveInformation() {
  const twiml = new VoiceResponse();

  twiml.say(
    'To get support via email, email us at support at ideawake.com',
    {voice: 'alice', language: 'en-GB'}
  );

  twiml.hangup();

  return twiml.toString();
}

/**
 * Returns a TwiML to interact with the client
 * @return {String}
 */
function listExtensions() {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: '/ivr/extensions',
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'To call sales, press 1. To call support, press 2. ' +
    'To go back to the main menu, press the star key now',
    {voice: 'alice', language: 'en-GB', loop: 3}
  );

  return twiml.toString();
}

/**
 * Returns a TwiML to interact with the client
 * @return {String}
 */
// function listPlanets() {
//   const twiml = new VoiceResponse();

//   const gather = twiml.gather({
//     action: '/ivr/extensions',
//     numDigits: '1',
//     method: 'POST',
//   });

//   gather.say(
//     'To call the planet Broh doe As O G, press 2. To call the planet DuhGo ' +
//     'bah, press 3. To call an oober asteroid to your location, press 4. To ' +
//     'go back to the main menu, press the star key ',
//     {voice: 'alice', language: 'en-GB', loop: 3}
//   );

//   return twiml.toString();
// }

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('Returning to the main menu', {
    voice: 'alice',
    language: 'en-GB',
  });

  twiml.redirect('/welcome');

  return twiml.toString();
}
