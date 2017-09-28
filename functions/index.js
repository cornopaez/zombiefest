// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Calendar Data
// { "calendar": [{ "person": "CraigBooth", "location": "Salisbury, MD", "contact": "2152224545", "dates": ["Sep 30 @ 3pm", "Oct 1 @ 10am"] }, { "person": "RichGuerrini", "location": "Pittsburgh, PA", "contact": "4125551212", "dates": ["Sep 30 @ 4pm", "Oct 1 @ 11am"] } ] }

'use strict';

process.env.DEBUG = 'actions-on-google:*';
let ApiAiApp = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

// APIAI Actions
const TRANSACTION_CHECK_NOPAYMENT = 'transaction.check.no.payment';
//const TRANSACTION_CHECK_ACTION_PAYMENT = 'transaction.check.action';
//const TRANSACTION_CHECK_GOOGLE_PAYMENT = 'transaction.check.google';
const TRANSACTION_CHECK_COMPLETE = 'transaction.check.complete';
const DELIVERY_ADDRESS = 'delivery.address';
const DELIVERY_ADDRESS_COMPLETE = 'delivery.address.complete';
const TRANSACTION_DECISION_ACTION_PAYMENT = 'transaction.decision.action';
const TRANSACTION_DECISION_COMPLETE = 'transaction.decision.complete';
const OPTION_SELECT = 'option.select';
const FINANCIAL_REVIEW = 'financial.review'
const BASIC_WELCOME = 'input.welcome'

exports.transactions = functions.https.onRequest((request, response) => {
  const app = new ApiAiApp({ request, response });
  // console.log('Request headers: ' + JSON.stringify(request.headers));
  // console.log('Request body: ' + JSON.stringify(request.body));

function financialReview (app) {

  app.ask(app.buildRichResponse()
    // Create a basic card and add it to the rich response

    .addSimpleResponse('Check out this offer:')
    .addBasicCard(app.buildBasicCard('') // Text for offer goes here
      .setTitle('') // Title for the offer goes here
      .addButton('Read more', '') // URL for offer goes here
      .setImage('https://example.google.com/42.png', 'Image alternate text') // Does this need revisiting?
    )
  );
}

function basicWelcome(app) {
  // TODO: Login with hardcoded credentials to Security API

  // TODO: Talk to Retail Customers API to get customer information

  // TODO: Talk to Retail Accounts to being all the account information

  // TODO: Talk to Wealth Insight to get investment information

  // TODO: Save that information to customer object for later use

  // TODO: Respond to API.AI with name of customer

  app.ask('Hello, Brett. What\'s going on?');
}

//function optionIntent (app) {
//  if (app.getSelectedOption() === PNC_Mortgage) {
//  if (app.getContextArgument() === PNC_Mortgage) {
//    app.tell('PNC Mortgage');
//  } else if (app.getContextArgument() === PNC_Cash_Rewards) {
//    app.tell('PNC Cash Rewards');
//  } else if (app.getContextArgument() === PNC_Investments) {
//    app.tell('PNC Investments');
//  } else if (app.getContextArgument() === PNC_Mobile_Banking) {
//    app.tell('PNC Mobile Banking');
//  }
//}    
    
function itemSelected (app) {
  // Get the user's selection
  const param = app.getContextArgument('actions_intent_option', 'OPTION').value;

  // Compare the user's selections to each of the item's keys
  if (!param) {
    app.ask('You did not select any item from the list');
  } else if (param === 'PNC Mortgage') {
    app.ask('You may qualify to take advantage of current rates as low as 4.125% on a 30 Yr Fixed mortgage. Would you like to discuss your options with a Mortgage advisor?');
  } else if (param === 'PNC Cash Rewards Visa') {
    app.ask('Carry the card that gives you more cash back every day for purchases at gas stations, restaurants, grocery stores, and more - with no rotating categories and no annual fee.');
  } else if (param === 'PNC Investments') {
    app.ask('PNC offers practical, strategic financial guidance and insight to help you achieve more with your money. Would you like to meet with a financial advisor?');
  } else if (param === 'PNC Mobile Banking') {
    app.ask('Manage your money on the go! Check your balance, pay a bill, transfer money and even deposit a check right from your mobile device.')
  } else {
    app.ask('You selected an unknown item from the list');
  }
}

// function financialReview(app) {

// }

function datetime (app) {
  app.askForDateTime('Which of these available dates and times work best for you?', 'What day is best to schedule your appointment?', 'What time of day works best for you?');
}
function dateTimeHandler (app) {
    if (app.getDateTime()) {
      app.tell({speech: 'Great, see you at your appointment!',
        displayText: 'Great, we\'ll see you on ' + app.getDateTime().date.month
        + '/' + app.getDateTime().date.day
        + ' at ' + app.getDateTime().time.hours
        + (app.getDateTime().time.minutes || '')});
    } else {
      app.tell('I\'m having a hard time finding an appointment');
    }
  }

function datetimeWithoutPrompt (app) {
  app.askForDateTime();
}
// TRANSACTIONS CODE
  function transactionCheckNoPayment (app) {
    app.askForTransactionRequirements();
  }
    
function createCart(app) {
    app.data.cart = app.buildCart()
        .setMerchant('pnc-bank', 'PNC Bank')
        .addLineItem(app.buildLineItem('class-burger-1', 'Classic Burger')
            .setType(ItemType.REGULAR)
            .setPrice(PriceType.ACTUAL, 'USD', 7)
            .setQuantity(1)
            .addSubLines(app.buildLineItem('bacon-1', 'Add Bacon')
                .setType(ItemType.REGULAR)
                .setPrice(PriceType.ACTUAL, 'USD', 1)
                .setQuantity(1)))
    .setNotes('Deliver by 7PM')
}
    
function createOrder(app) {
    return app.buildOrder()
        .setCart(app.data.cart)
        .setImage('http://example.com/burgers.png', 'Burgers')
        .addOtherItems(app.buildLineItem('tax', 'Tax')
            .setPrice('USD', 1, 420000000))
        .setTotalPrice(PriceType.ACTUAL, 'USD', 25, 860000000)
}

//  function transactionCheckActionPayment (app) {
//    app.askForTransactionRequirements({
//      type: app.Transactions.PaymentType.PAYMENT_CARD,
//      displayName: 'VISA-1234',
//      deliveryAddressRequired: false
//    });
//  }

//  function transactionCheckGooglePayment (app) {
//    app.askForTransactionRequirements({
//      // These will be provided by payment processor, like Stripe, Braintree, or
//      // Vantiv
//      tokenizationParameters: {},
//      cardNetworks: [
//        app.Transactions.CardNetwork.VISA,
//        app.Transactions.CardNetwork.AMEX
//      ],
//      prepaidCardDisallowed: false,
//      deliveryAddressRequired: false
//    });
//  }

  function transactionCheckComplete (app) {
    if (app.getTransactionRequirementsResult() === app.Transactions.ResultType.OK) {
      // Normally take the user through cart building flow
      app.ask('Looks like you\'re good to go! Try saying "Get Delivery Address".');
    } else {
      app.tell('Transaction failed.');
    }
  }

  function deliveryAddress (app) {
    app.askForDeliveryAddress('To schedule an appointment closest to you');
  }

  function deliveryAddressComplete (app) {
    if (app.getDeliveryAddress()) {
      console.log('DELIVERY ADDRESS: ' +
        app.getDeliveryAddress().postalAddress.addressLines[0]);
      app.ask('Thanks! Are you ready to confirm the appointment?');
    } else {
      app.tell('I need your address to schedule an appointment near you.');
    }
  }

  function transactionDecision (app) {
    let order = app.buildOrder('<UNIQUE_ORDER_ID>')
      .setCart(app.buildCart().setMerchant('pnc-bank', 'PNC BANK')
        .addLineItems([
          app.buildLineItem('appt_1', 'PNC Investments')
//            .setPrice(app.Transactions.PriceType.ACTUAL, 'USD', 5, 990000000)
//            .setQuantity(1)
            .addSublines(['Location: Street Address', 'City and State', 'Date: Date Chosen', 'Time: Time Chosen']),
        ])
      .setNotes('You will be meeting with Advisor Name.'))
//      .addOtherItems([
//        app.buildLineItem('subtotal', 'Subtotal')
//          .setType(app.Transactions.ItemType.SUBTOTAL)
//          .setQuantity(1)
//          .setPrice(app.Transactions.PriceType.ESTIMATE, 'USD', 5, 510000000),
//        app.buildLineItem('tax', 'Tax')
//          .setType(app.Transactions.ItemType.TAX)
//          .setQuantity(1)
//          .setPrice(app.Transactions.PriceType.ESTIMATE, 'USD', 0, 500000000)
//      ])
//      .setTotalPrice(app.Transactions.PriceType.ESTIMATE, 'USD', 6, 100000000);

    // If in sandbox testing mode, do not require payment
    if (app.isInSandbox()) {
      app.askForTransactionDecision(order);
    } else {
      // To test this sample, uncheck the 'Testing in Sandbox Mode' box in the
      // Actions console simulator
      app.askForTransactionDecision(order, {
        type: app.Transactions.PaymentType.PAYMENT_CARD,
        displayName: 'VISA-1234',
        deliveryAddressRequired: true
      });

      /*
        // If using Google provided payment instrument instead
        app.askForTransactionDecision(order, {
          // These will be provided by payment processor, like Stripe,
          // Braintree, or Vantiv
          tokenizationParameters: {},
          cardNetworks: [
            app.Transactions.CardNetwork.VISA,
            app.Transactions.CardNetwork.AMEX
          ],
          prepaidCardDisallowed: false,
          deliveryAddressRequired: false
        });
      */
    }
  }

  function transactionDecisionComplete (app) {
    if (app.getTransactionDecision() &&
      app.getTransactionDecision().userDecision ===
        app.Transactions.ConfirmationDecision.ACCEPTED) {
      let googleOrderId = app.getTransactionDecision().order.googleOrderId;

        
app.buildOrderUpdate('google_order_123', true)
        .setOrderState(
            app.Transaction.OrderState.IN_TRANSIT, 'Food arriving')
        .setUpdateTime(seconds)
        .setUserNotification(
            'Your FoodShop order is on the way', 'It should arrive in 20 mins')
        .addOrderManagementAction(
            app.Transactions.OrderAction.VIEW_DETAILS,
            'Contact customer service',
            'https://example.com/customer_service');

      // Confirm order and make any charges in order processing backend
      // If using Google provided payment instrument:
      // let paymentToken = app.getTransactionDecision().order.paymentInfo
      //   .googleProvidedPaymentInstrument.instrumentToken;

      app.tell(app.buildRichResponse().addOrderUpdate(
        app.buildOrderUpdate(googleOrderId, true)
          .setOrderState(app.Transactions.OrderState.CREATED, 'Order created')
          .setInfo(app.Transactions.OrderStateInfo.RECEIPT, {
            confirmedActionOrderId: '<UNIQUE_ORDER_ID>'
          }))
        .addSimpleResponse('Appointment Scheduled! You\'re all set!'));
    } else if (app.getTransactionDecision() &&
      app.getTransactionDecision().userDecision ===
        app.Transactions.ConfirmationDecision.DELIVERY_ADDRESS_UPDATED) {
      return deliveryAddress(app);
    } else {
      app.tell('Transaction failed.');
    }
  }

  const actionMap = new Map();
  actionMap.set(TRANSACTION_CHECK_NOPAYMENT, transactionCheckNoPayment);
//  actionMap.set(TRANSACTION_CHECK_ACTION_PAYMENT, transactionCheckActionPayment);
//  actionMap.set(TRANSACTION_CHECK_GOOGLE_PAYMENT, transactionCheckGooglePayment);
  actionMap.set(TRANSACTION_CHECK_COMPLETE, transactionCheckComplete);
  actionMap.set(DELIVERY_ADDRESS, deliveryAddress);
  actionMap.set(DELIVERY_ADDRESS_COMPLETE, deliveryAddressComplete);
  actionMap.set(TRANSACTION_DECISION_ACTION_PAYMENT, transactionDecision);
  actionMap.set(TRANSACTION_DECISION_COMPLETE, transactionDecisionComplete);
  actionMap.set(OPTION_SELECT, itemSelected);
  actionMap.set(FINANCIAL_REVIEW, financialReview)
  actionMap.set(BASIC_WELCOME, basicWelcome)

  app.handleRequest(actionMap);
});
