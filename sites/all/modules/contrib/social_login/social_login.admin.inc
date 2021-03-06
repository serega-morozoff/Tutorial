<?php
/**
 * @file
 * Contains the administration interface for the Oneall Social Login Module.
 * The user may chose where to display the module and setup it's behavior.
 */

/**
 * Displays the settings page.
 */
function social_login_admin_settings($form, &$form_state) {

  // Used to display the provider icons.
  drupal_add_css(drupal_get_path('module', 'social_login') . '/social_login.admin.css');

  // Read Settings.
  $settings = social_login_core_get_settings();

  // API Connection.
  $form['social_login_api_connection'] = array(
    '#type' => 'fieldset',
    '#title' => t('API Communication'),
    '#id' => 'social_login_api_connection',
  );

  // Default value for handler.
  if (!empty($form_state['values']['http_handler'])) {
    $default = $form_state['values']['http_handler'];
  }
  elseif (!empty($settings['http_handler'])) {
    $default = $settings['http_handler'];
  }
  else {
    $default = 'curl';
  }

  $form['social_login_api_connection']['http_handler'] = array(
    '#type' => 'select',
    '#title' => t('API Communication Handler'),
    '#description' => t('Either <a href="@link_curl" target="_blank">PHP cURL</a> or the <a href="@link_fsockopen" target="_blank">PHP fsockopen function</a> must be available on your server.', array(
      '@link_curl' => 'http://www.php.net/manual/en/book.curl.php',
      '@link_fsockopen' => 'http://php.net/manual/en/function.fsockopen.php',
    )),
    '#options' => array(
      'curl' => t('PHP cURL library'),
      'fsockopen' => t('PHP fsockopen through drupal_http_request()'),
    ),
    '#default_value' => $default,
  );

  // Default value for protocol.
  if (!empty($form_state['values']['http_protocol'])) {
    $default = $form_state['values']['http_protocol'];
  }
  elseif (!empty($settings['http_protocol'])) {
    $default = $settings['http_protocol'];
  }
  else {
    $default = 'https';
  }

  $form['social_login_api_connection']['http_protocol'] = array(
    '#type' => 'select',
    '#title' => t('API Communication Protocol'),
    '#description' => t('Your firewall must allow outbound requests either on port 443/HTTPS or on port 80/HTTP.'),
    '#options' => array(
      'https' => t('Port 443/HTTPS'),
      'http' => t('Port 80/HTTP'),
    ),
    '#default_value' => $default,
  );

  // AutoDetect Button.
  $form['social_login_api_connection']['autodetect'] = array(
    '#type' => 'button',
    '#value' => t('Autodetect communication settings'),
    '#weight' => 30,
    '#ajax' => array(
      'callback' => 'social_login_admin_ajax_api_connection_autodetect',
      'wrapper' => 'social_login_api_connection',
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // API Settings.
  $form['social_login_api_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('API Settings'),
    '#id' => 'social_login_api_settings',
    '#description' => t('<a href="@setup_social_login" target="_blank">Click here to create and view your API Credentials</a>', array(
      '@setup_social_login' => 'https://app.oneall.com/applications/',
    )),
  );

  // API Subdomain.
  $form['social_login_api_settings']['api_subdomain'] = array(
    '#id' => 'api_subdomain',
    '#type' => 'textfield',
    '#title' => t('API Subdomain'),
    '#default_value' => (!empty($settings['api_subdomain']) ? $settings['api_subdomain'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Public Key.
  $form['social_login_api_settings']['api_key'] = array(
    '#id' => 'api_key',
    '#type' => 'textfield',
    '#title' => t('API Public Key'),
    '#default_value' => (!empty($settings['api_key']) ? $settings['api_key'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Private Key.
  $form['social_login_api_settings']['api_secret'] = array(
    '#id' => 'api_secret',
    '#type' => 'textfield',
    '#title' => t('API Private Key'),
    '#default_value' => (!empty($settings['api_secret']) ? $settings['api_secret'] : ''),
    '#size' => 60,
    '#maxlength' => 60,
  );

  // API Verify Settings Button.
  $form['social_login_api_settings']['verify'] = array(
    '#id' => 'social_login_check_api_button',
    '#type' => 'button',
    '#value' => t('Verify API Settings'),
    '#weight' => 1,
    '#ajax' => array(
      'callback' => 'social_login_admin_ajax_check_api_connection_settings',
      'wrapper' => 'social_login_api_settings',
      'method' => 'replace',
      'effect' => 'fade',
    ),
  );

  // Side panel settings.
  $form['social_login_settings_side_panel'] = array(
    '#type' => 'fieldset',
    '#title' => t('Side Panel Settings'),
  );

  $form['social_login_settings_side_panel']['side_panel_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to login/register with their social network account or with their already existing account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form'),
      'below' => t('Show the Social Login icons below the existing login form (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons in the side panel'),
    ),
    '#default_value' => (empty($settings['side_panel_icons']) ? 'above' : $settings['side_panel_icons']),
  );

  $form['social_login_settings_side_panel']['side_panel_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['side_panel_caption']) ? t('Register/Login with:') : $settings['side_panel_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  // Login page settings.
  $form['social_login_settings_login_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Login Page Settings'),
  );

  $form['social_login_settings_login_page']['login_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to login either with their social network account or with their already existing account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form'),
      'below' => t('Show the Social Login icons below the existing login form (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons on the login page'),
    ),
    '#default_value' => (empty($settings['login_page_icons']) ? 'below' : $settings['login_page_icons']),
  );

  $form['social_login_settings_login_page']['login_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['login_page_caption']) ? t('Login with:') : $settings['login_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  // Registration page settings.
  $form['social_login_settings_registration_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Registration Page Settings'),
  );

  $form['social_login_settings_registration_page']['registration_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to register by using either their social network account or by creating a new account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the existing login form (Default, recommended)'),
      'below' => t('Show the Social Login icons below the existing login form'),
      'disable' => t('Do not show the Social Login icons on the registration page'),
    ),
    '#default_value' => (empty($settings['registration_page_icons']) ? 'above' : $settings['registration_page_icons']),
  );

  $form['social_login_settings_registration_page']['registration_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['registration_page_caption']) ? t('Instantly register with:') : $settings['registration_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  // Edit profile page settings.
  $form['social_login_settings_profile_page'] = array(
    '#type' => 'fieldset',
    '#title' => t('Edit Profile Page Settings'),
  );

  $form['social_login_settings_profile_page']['profile_page_icons'] = array(
    '#type' => 'select',
    '#title' => t('Social Login Icons'),
    '#description' => t('Allows the users to link a social network account to their regular account.'),
    '#options' => array(
      'above' => t('Show the Social Login icons above the profile settings'),
      'below' => t('Show the Social Login icons below the profile settings (Default, recommended)'),
      'disable' => t('Do not show the Social Login icons on the profile page'),
    ),
    '#default_value' => (empty($settings['profile_page_icons']) ? 'below' : $settings['profile_page_icons']),
  );

  $form['social_login_settings_profile_page']['profile_page_caption'] = array(
    '#type' => 'textfield',
    '#title' => t('Social Login Icons: Caption [Leave empty for none]'),
    '#default_value' => (!isset($settings['profile_page_caption']) ? t('Link your account to a social network:') : $settings['profile_page_caption']),
    '#size' => 60,
    '#maxlength' => 60,
    '#description' => t('This is the title displayed above the social network icons.'),
  );

  // Block Settings.
  $form['social_login_settings_block'] = array(
    '#type' => 'fieldset',
    '#title' => t('Block Settings'),
    '#description' => t('Use the Structure\Blocks menu to add Social Login to any region of your theme.'),
  );

  $form['social_login_settings_block']['block_icons_loggedin'] = array(
    '#type' => 'select',
    '#title' => t('If the user is already logged in:'),
    '#options' => array(
      'hide' => t('Hide the Social Login Block (Default, recommended)'),
      'show' => t('Show the Social Login Block'),
    ),
    '#default_value' => (empty($settings['block_icons_loggedin']) ? 'hide' : $settings['block_icons_loggedin']),
  );

  // Account creation settings.
  $form['social_login_settings_account_creation'] = array(
    '#type' => 'fieldset',
    '#title' => t('Account creation settings'),
  );

  $form['social_login_settings_account_creation']['registration_approval'] = array(
    '#type' => 'select',
    '#title' => t('Do user that register with Social Login have to be approved by an administrator?'),
    '#description' => t('Manual approval should not be required as Social Login eliminates SPAM issues almost entirely.'),
    '#options' => array(
      'inherit' => t('Use the system-wide setting from the Drupal account settings (Default)'),
      'disable' => t('Automatically approve users that register with Social Login'),
      'enable' => t(' Always require administrators to approve users that register with Social Login'),
    ),
    '#default_value' => (empty($settings['registration_approval']) ? 'inherit' : $settings['registration_approval']),
  );

  $form['social_login_settings_account_creation']['registration_retrieve_avatars'] = array(
    '#type' => 'select',
    '#title' => t('Retrieve the user picture from the social network when a user registers with Social Login?'),
    '#description' => t('Social Login grabs the user picture from the social network, saves it locally and uses it as avatar for the new account.'),
    '#options' => array(
      'enable' => t('Yes, retrieve the user picture from the social network an use it as avatar for the user (Default)'),
      'disable' => t('No, do not retrieve the user picture from the social network'),
    ),
    '#default_value' => (empty($settings['registration_retrieve_avatars']) ? 'enable' : $settings['registration_retrieve_avatars']),
  );

  $form['social_login_settings_account_creation']['registration_method'] = array(
    '#type' => 'select',
    '#title' => t('Automatically create a new user account when a user registers with Social Login?'),
    '#description' => t('If a user registers for example with Facebook, Social Login grabs his Facebook profile data and uses it to simply the user registration.'),
    '#options' => array(
      'manual' => t('Do not create new accounts automatically, just pre-populate the default registration form and let users complete the registration manually (Default)'),
      'auto_random_email' => t('Automatically create new user accounts and generate a bogus email address if the social network provides no email address'),
      'auto_manual_email' => t('Automatically create new user accounts BUT fall back to the default registration form when the social network provides no email address'),
    ),
    '#default_value' => (empty($settings['registration_method']) ? 'manual' : $settings['registration_method']),
  );

  // Enable the social networks/identity providers.
  $form['social_login_providers'] = array(
    '#type' => 'fieldset',
    '#title' => t('Enable the social networks/identity providers of your choice'),
  );

  // Include the list of providers.
  $social_login_available_providers = social_login_core_get_available_providers();

  // Add providers.
  foreach ($social_login_available_providers as $key => $provider_data) {
    $form['social_login_providers']['social_login_icon_' . $key] = array(
      '#title' => check_plain($provider_data['name']),
      '#type' => 'container',
      '#attributes' => array(
        'class' => array(
          'social_login_provider',
          'social_login_provider_' . $key,
        ),
        'style' => array(
          'float: left;',
          'margin: 5px;',
        ),
      ),
    );

    $form['social_login_providers']['provider_' . $key] = array(
      '#type' => 'checkbox',
      '#title' => check_plain($provider_data['name']),
      '#default_value' => (empty($settings['provider_' . $key]) ? 0 : 1),
      '#attributes' => array(
        'style' => array(
          'margin: 15px;',
        ),
      ),
    );

    $form['social_login_providers']['clear_' . $key] = array(
      '#type' => 'container',
      '#attributes' => array(
        'style' => array(
          'clear: both;',
        ),
      ),
    );
  }

  $form['#submit'][] = 'social_login_admin_settings_submit';
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save Settings'),
  );

  return $form;
}


/**
 * Callback handler to autodected the API connection handler.
 */
function social_login_admin_ajax_api_connection_autodetect($form, &$form_state) {

  // Detected Settings.
  $http_handler = '';
  $http_protocol = '';

  // CURL+HTTPS Works.
  if (social_login_core_check_curl('https') === TRUE) {
    $http_handler = 'curl';
    $http_protocol = 'https';
  }
  // FSOCKOPEN+HTTPS Works.
  elseif (social_login_core_check_fsockopen('https') == TRUE) {
    $http_handler = 'fsockopen';
    $http_protocol = 'https';
  }
  // CURL+HTTP Works.
  elseif (social_login_core_check_curl('http') === TRUE) {
    $http_handler = 'curl';
    $http_protocol = 'http';
  }
  // FSOCKOPEN+HTTP Works.
  elseif (social_login_core_check_fsockopen('http') == TRUE) {
    $http_handler = 'fsockopen';
    $http_protocol = 'http';
  }

  // Working handler found.
  if (!empty($http_handler)) {
    $form['social_login_api_connection']['http_handler']['#value'] = $http_handler;
    $form['social_login_api_connection']['http_protocol']['#value'] = $http_protocol;
    drupal_set_message(t('Autodetected @handler on port @port - do not forget to save your changes!', array(
      '@handler' => ($http_handler == 'curl' ? 'PHP cURL' : 'PHP fsockopen'),
      '@port' => ($http_protocol == 'http' ? '80/HTTP' : '443/HTTPS'),
    )), 'status social_login');
  }
  // Nothing works.
  else {
    drupal_set_message(t('Sorry, but the autodetection failed. Please try to open port 80/443 for outbound requests and install PHP cURL/fsockopen.'), 'error social_login');
  }
  return $form['social_login_api_connection'];
}

/**
 * Callback Handler to verify the API Settings.
 */
function social_login_admin_ajax_check_api_connection_settings($form, &$form_state) {

  // Sanitize data.
  $api_subdomain = (isset($form_state['values']['api_subdomain']) ? trim(drupal_strtolower($form_state['values']['api_subdomain'])) : '');
  $api_key = (isset($form_state['values']) ? trim($form_state['values']['api_key']) : '');
  $api_secret = (isset($form_state['values']) ? trim($form_state['values']['api_secret']) : '');

  $handler = (isset($form['social_login_api_connection']['http_handler']['#value']) ? $form['social_login_api_connection']['http_handler']['#value'] : 'curl');
  $handler = ($handler == 'fsockopen' ? 'fsockopen' : 'curl');

  $protocol = (isset($form['social_login_api_connection']['http_protocol']['#value']) ? $form['social_login_api_connection']['http_protocol']['#value'] : 'https');
  $protocol = ($protocol == 'http' ? 'http' : 'https');

  // Messages to be shown.
  $error_message = '';
  $success_message = '';

  // Some fields are empty.
  if (empty($api_subdomain) || empty($api_key) || empty($api_secret)) {
    $error_message = t('Please fill out each of the fields below');
  }
  // All fields have been filled out.
  else {

    // Wrapper for full domains.
    if (preg_match("/([a-z0-9\-]+)\.api\.oneall\.com/i", $api_subdomain, $matches)) {
      $api_subdomain = trim($matches[1]);
    }

    // Wrong syntax.
    if (!preg_match("/^[a-z0-9\-]+$/i", $api_subdomain)) {
      $error_message = t('The subdomain has a wrong syntax! Have you filled it out correctly?');
    }
    // Syntax seems to be OK.
    else {

      // Build API Settings.
      $api_domain = $protocol . '://' . $api_subdomain . '.api.oneall.com/tools/ping.json';
      $api_options = array(
        'api_key' => $api_key,
        'api_secret' => $api_secret,
      );

      // Send request.
      $result = social_login_core_do_api_request($handler, $api_domain, $api_options);
      if (!is_array($result)) {
        $error_message = t('Could not contact API. Your firewall probably blocks outoing requests on both ports (443 and 80)');
      }
      else {
        switch ($result['http_code']) {
          case '401':
            $error_message = t('The API credentials are wrong!');
            break;

          case '404':
            $error_message = t('The subdomain does not exist. Have you filled it out correctly?');
            break;

          case '200':
            $success_message = t('The settings are correct - do not forget to save your changes!');
            break;

          default:
            $error_message = t('Unknown API Error');
            break;
        }
      }
    }
  }

  // Error.
  if (!empty($success_message)) {
    drupal_set_message($success_message, 'status social_login');
  }
  else {
    drupal_set_message($error_message, 'error social_login');
  }
  return $form['social_login_api_settings'];
}

/**
 * Saves the administration area settings.
 */
function social_login_admin_settings_submit($form, &$form_state) {

  // Remove Drupal stuff.
  form_state_values_clean($form_state);

  // Save values.
  foreach ($form_state['values'] as $setting => $value) {

    $value = trim($value);

    // API Subdomain.
    if ($setting == 'api_subdomain') {
      // The subdomain is always in lower-case
      $value = drupal_strtolower($value);

      // Wrapper for full domains.
      if (preg_match("/([a-z0-9\-]+)\.api\.oneall\.com/i", $value, $matches)) {
        $value = trim($matches[1]);
      }
    }

    $oaslsid = db_select('oneall_social_login_settings', 'o')->fields('o', array('oaslsid'))->condition('setting', $setting, '=')->execute()->fetchField();
    if (is_numeric($oaslsid)) {
      db_update('oneall_social_login_settings')->fields(array('value' => $value))->condition('oaslsid', $oaslsid, '=')->execute();
    }
    else {
      db_insert('oneall_social_login_settings')->fields(array('setting' => $setting, 'value' => $value))->execute();
    }
  }
  drupal_set_message(t('Settings saved successfully'), 'status social_login');
  cache_clear_all();
  menu_rebuild();
}
