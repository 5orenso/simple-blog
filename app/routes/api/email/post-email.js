/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2021 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const {
    initOpt, run, util, webUtil, musherUtil, tc, Race, uuidv4, Mail, Markdown,
} = require('../../../middleware/init')({ __filename, __dirname });

const emailSender = 'post@themusher.no';
const emailTemplate = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{subject}}</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      
      /*All the styling goes here*/
      
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; 
      }

      body {
        background-color: #f6f6f6;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 15px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top; 
      }

      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */

      .body {
        background-color: #f6f6f6;
        width: 100%; 
      }

      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        margin: 0 auto !important;
        /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px; 
      }

      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 580px;
        padding: 10px; 
      }

      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: #ffffff;
        border-radius: 3px;
        width: 100%; 
      }

      .wrapper {
        box-sizing: border-box;
        padding: 20px; 
      }

      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }

      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%; 
      }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center; 
      }

      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px; 
      }

      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize; 
      }

      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px; 
      }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px; 
      }

      a {
        color: #3498db;
        text-decoration: underline; 
      }

      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%; }
        .btn > tbody > tr > td {
          padding-bottom: 15px; }
        .btn table {
          width: auto; 
      }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center; 
      }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize; 
      }

      .btn-primary table td {
        background-color: #3498db; 
      }

      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff; 
      }

      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0; 
      }

      .first {
        margin-top: 0; 
      }

      .align-center {
        text-align: center; 
      }

      .align-right {
        text-align: right; 
      }

      .align-left {
        text-align: left; 
      }

      .clear {
        clear: both; 
      }

      .mt0 {
        margin-top: 0; 
      }

      .mb0 {
        margin-bottom: 0; 
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0; 
      }

      .powered-by a {
        text-decoration: none; 
      }

      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        margin: 20px 0; 
      }

      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class=body] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; 
        }
        table[class=body] p,
        table[class=body] ul,
        table[class=body] ol,
        table[class=body] td,
        table[class=body] span,
        table[class=body] a {
          font-size: 16px !important; 
        }
        table[class=body] .wrapper,
        table[class=body] .article {
          padding: 10px !important; 
        }
        table[class=body] .content {
          padding: 0 !important; 
        }
        table[class=body] .container {
          padding: 0 !important;
          width: 100% !important; 
        }
        table[class=body] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; 
        }
        table[class=body] .btn table {
          width: 100% !important; 
        }
        table[class=body] .btn a {
          width: 100% !important; 
        }
        table[class=body] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; 
        }
      }

      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%; 
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%; 
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important; 
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important; 
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; 
        } 
      }

    </style>
  </head>
  <body class="">
    <span class="preheader">If you can't read the email, please check out the info at https://homerunrace.no/</span>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table role="presentation" class="main">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <img src="https://homerunrace.no/assets/homerun-race-logo-2-small.png" alt="Logo" width="55" height="50" style="float: left" />
                        <h2>{{raceTitle}}</h2>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {{body}}
                      </td>
                    </tr>
                    <tr>
                      <td style="text-align: center;">
                        <hr />
                        Useful links:<br />
                        <a href="https://homerunrace.no/index#/race/{{raceId}}">Racepage</a>
                        | <a href="https://homerunrace.no/index#/race/{{raceId}}/mushers">Mushers</a>
                        | <a href="https://homerunrace.no/index#/race/{{raceId}}/results">Results</a>
                        | <a href="https://homerunrace.no/index#/race/{{raceId}}/media">Media</a>
                        | <a href="https://homerunrace.no/index#/race/{{raceId}}/tracking">Tracking</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>
            <!-- END CENTERED WHITE CONTAINER -->

            <!-- START FOOTER -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">Homerun Race / <a href="https://homerunrace.no/">homerunrace.no</a></span>
                    / <a href="https://www.facebook.com/TheMusher">Facebook</a>
                    / <a href="https://www.instagram.com/themusherapp/">Instagram</a>
                    <!--<br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.-->
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                    <img src="https://themusher.litt.no/assets/logo.png" alt="The Musher logo" width="50" height="50" /><br />
                    Powered by <a href="https://themusher.no/">The Musher</a>.<br />
                    Get the app in <a href="https://apps.apple.com/no/app/the-musher/id1553911346#?platform=iphone">Apple AppStore</a> or <a href="https://play.google.com/store/apps/details?id=io.cordova.litt.no.themusher">Google Play Store</a>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = async (req, res) => {
    const { runOpt } = run(req);

    const { currentUser, stopRequest } = await musherUtil.loadApiCommon(req, res);
    if (stopRequest) { return false; }

    const mail = new Mail(req.config);
    const race = new Race();

    const requiredBodyFields = ['to', 'subject', 'body', 'raceClassId', 'raceId'];
    if (!webUtil.hasAllRequiredFields(req, res, 'body', requiredBodyFields)) {
        return false;
    }

    for (let i = 0, l = requiredBodyFields.length; i < l; i += 1) {
        const field = requiredBodyFields[i];
        if (!req.body[field] || req.body[field].length === 0 || req.body[field] === '') {
            const response = {
                status: 400,
                message: `Missing data in field: ${field}`,
            };
            return webUtil.renderApi(req, res, { response, ...initOpt, ...runOpt });
        }
    }

    const currentRace = await race.findOne({
        offline: { $ne: 1 },
        id: tc.asNumber(req.body.raceId),
    });

    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Send emails one by one
    const to = tc.asArray(req.body.to.split(','));
    const subject = tc.asString(req.body.subject);
    const body = tc.asString(req.body.body);
    const bodyMarkdown = Markdown.render(body);
    const bodyHtml = emailTemplate
        .replace(/\{\{raceId\}\}/g, currentRace.id)
        .replace(/\{\{raceTitle\}\}/g, currentRace.title)
        .replace(/\{\{subject\}\}/g, subject)
        .replace(/\{\{body\}\}/g, bodyMarkdown);
    const emailPromises = [];

    for (let i = 0, l = to.length; i < l; i += 1) {
        const emailAddress = to[i];
        emailPromises.push(
            mail.sendEmail({
                to: emailAddress,
                from: emailSender,
                subject,
                body: bodyHtml,
                bodyText: body,
            }),
        );
    }
    const emailResults = await Promise.all(emailPromises);
    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Add new email to race class
    const id = req.body.raceClassId;
    const query = {
        id: currentRace.id,
        classes: {
            $elemMatch: { id },
        },
    };
    const updateObject = {
        $addToSet: {
            'classes.$.emails': {
                id: uuidv4(),
                date: new Date(),
                to,
                subject,
                body,
            },
        },
    };
    await race.rawUpdate(query, updateObject);
    // -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    const response = {
        status: 200,
        message: `Emails sent`,
        data: emailResults,
    };
    return webUtil.renderApi(req, res, { response, ...initOpt, ...runOpt });
};
