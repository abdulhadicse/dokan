import { Page } from '@playwright/test';
import { AdminPage } from '@pages/adminPage';
import { selector } from '@pages/selectors';
import { data } from '@utils/testData';
import { payment, vendor } from '@utils/interfaces';

// selectors
const woocommerceSettings = selector.admin.wooCommerce.settings;
const paymentSettingsAdmin = selector.admin.wooCommerce.settings.payments;
const paymentSettingsVendor = selector.vendor.vPaymentSettings;

export class PaymentsPage extends AdminPage {
    constructor(page: Page) {
        super(page);
    }

    // payment methods

    async goToWcPaymentSettings() {
        await this.goIfNotThere(data.subUrls.backend.wc.paymentSettings);
    }

    // admin setup basic payment methods
    async setupBasicPaymentMethods(payment: payment) {
        await this.goToWcPaymentSettings();

        // bank transfer
        await this.enablePaymentMethod(paymentSettingsAdmin.enableDirectBankTransfer);
        // payments
        await this.enablePaymentMethod(paymentSettingsAdmin.enableCheckPayments);
        // cash on delivery
        await this.enablePaymentMethod(paymentSettingsAdmin.enableCashOnDelivery);

        await this.removeAttribute(paymentSettingsAdmin.paymentMethodsSaveChanges, 'disabled');
        await this.clickAndWaitForResponse(data.subUrls.api.wc.paymentGateways, paymentSettingsAdmin.paymentMethodsSaveChanges);
        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // enable MangoPay module
    async enableMangoPayModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings);
        await this.toBeVisible(paymentSettingsAdmin.setupDokanMangoPay);
    }

    // enable PayPal Marketplace module
    async enablePayPalMarketplaceModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings);
        await this.toBeVisible(paymentSettingsAdmin.setupDokanPayPalMarketplace);
    }

    // enable Razorpay module
    async enableRazorpayModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings);
        await this.toBeVisible(paymentSettingsAdmin.setupDokanRazorpay);
    }

    // enable Stripe Connect module
    async enableStripeConnectModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings);
        await this.toBeVisible(paymentSettingsAdmin.setupDokanStripeConnect);
    }

    // enable Stripe Express module
    async enableStripeExpressModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings);
        await this.toBeVisible(paymentSettingsAdmin.setupDokanStripeExpress);
    }

    // disable MangoPay module
    async disableMangoPayModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings, { waitUntil: 'domcontentloaded' }, true);
        await this.notToBeVisible(paymentSettingsAdmin.setupDokanMangoPay);

        await this.goto(data.subUrls.backend.wc.mangoPaySettings);
        await this.notToBeVisible(paymentSettingsAdmin.dokanMangoPay.mangoPayText);
    }

    // disable PayPal Marketplace module
    async disablePayPalMarketplaceModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings, { waitUntil: 'domcontentloaded' }, true);
        await this.notToBeVisible(paymentSettingsAdmin.setupDokanPayPalMarketplace);

        await this.goto(data.subUrls.backend.wc.paypalMarketplaceSettings);
        await this.notToBeVisible(paymentSettingsAdmin.paypalMarketPlace.paypalMarketPlaceText);
    }

    // disable Razorpay module
    async disableRazorpayModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings, { waitUntil: 'domcontentloaded' }, true);
        await this.notToBeVisible(paymentSettingsAdmin.setupDokanRazorpay);

        await this.goto(data.subUrls.backend.wc.razorPaySettings);
        await this.notToBeVisible(paymentSettingsAdmin.dokanRazorpay.razorpayText);
    }

    // disable Stripe Connect module
    async disableStripeConnectModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings, { waitUntil: 'domcontentloaded' }, true);
        await this.notToBeVisible(paymentSettingsAdmin.setupDokanStripeConnect);

        await this.goto(data.subUrls.backend.wc.stripeConnectSettings);
        await this.notToBeVisible(paymentSettingsAdmin.stripe.stripeConnectText);
    }

    // disable Stripe Express module
    async disableStripeExpressModule() {
        await this.goto(data.subUrls.backend.wc.paymentSettings, { waitUntil: 'domcontentloaded' }, true);
        await this.notToBeVisible(paymentSettingsAdmin.setupDokanStripeExpress);

        await this.goto(data.subUrls.backend.wc.stripeExpressSettings);
        await this.notToBeVisible(paymentSettingsAdmin.stripeExpress.stripeExpressText);
    }

    // admin setup stripe connect
    async setupStripeConnect(payment: payment) {
        await this.goto(data.subUrls.backend.wc.stripeConnectSettings);

        // setup strip connect
        await this.check(paymentSettingsAdmin.stripe.enableDisableStripe);
        await this.clearAndType(paymentSettingsAdmin.stripe.title, payment.stripeConnect.title);
        await this.clearAndType(paymentSettingsAdmin.stripe.description, payment.stripeConnect.description);
        await this.check(paymentSettingsAdmin.stripe.nonConnectedSellers);
        await this.check(paymentSettingsAdmin.stripe.displayNoticeToConnectSeller);
        await this.clearAndType(paymentSettingsAdmin.stripe.displayNoticeInterval, payment.stripeConnect.displayNoticeInterval);
        await this.check(paymentSettingsAdmin.stripe.threeDSecureAndSca);
        await this.check(paymentSettingsAdmin.stripe.sellerPaysTheProcessingFeeIn3DsMode);
        await this.check(paymentSettingsAdmin.stripe.testMode);
        await this.check(paymentSettingsAdmin.stripe.savedCards);
        // test credentials
        await this.clearAndType(paymentSettingsAdmin.stripe.testPublishableKey, payment.stripeConnect.testPublishableKey);
        await this.clearAndType(paymentSettingsAdmin.stripe.testSecretKey, payment.stripeConnect.testSecretKey);
        await this.clearAndType(paymentSettingsAdmin.stripe.testClientId, payment.stripeConnect.testClientId);
        await this.removeAttribute(paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges, 'disabled');
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.backend.wc.stripeConnectSettings, paymentSettingsAdmin.stripe.stripeSaveChanges);

        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // admin setup dokan paypal marketplace
    async setupPaypalMarketPlace(payment: payment) {
        await this.goto(data.subUrls.backend.wc.paypalMarketplaceSettings);

        // setup paypal marketplace
        await this.check(paymentSettingsAdmin.paypalMarketPlace.enableDisablePayPalMarketplace);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.title, payment.paypalMarketPlace.title);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.description, payment.paypalMarketPlace.description);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.payPalMerchantId, payment.paypalMarketPlace.payPalMerchantId);
        // api credentials
        await this.check(paymentSettingsAdmin.paypalMarketPlace.payPalSandbox);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.sandboxClientId, payment.paypalMarketPlace.sandboxClientId);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.sandBoxClientSecret, payment.paypalMarketPlace.sandBoxClientSecret);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.payPalPartnerAttributionId, payment.paypalMarketPlace.payPalPartnerAttributionId);
        await this.click(paymentSettingsAdmin.paypalMarketPlace.disbursementMode);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.paypalMarketPlace.disbursementModeValues, payment.paypalMarketPlace.disbursementMode);
        await this.click(paymentSettingsAdmin.paypalMarketPlace.paymentButtonType);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.paypalMarketPlace.paymentButtonTypeValues, payment.paypalMarketPlace.paymentButtonType);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.marketplaceLogo, this.getBaseUrl() + payment.paypalMarketPlace.marketplaceLogoPath);
        await this.check(paymentSettingsAdmin.paypalMarketPlace.displayNoticeToConnectSeller);
        await this.check(paymentSettingsAdmin.paypalMarketPlace.sendAnnouncementToConnectSeller);
        await this.clearAndType(paymentSettingsAdmin.paypalMarketPlace.sendAnnouncementInterval, payment.paypalMarketPlace.announcementInterval);
        await this.removeAttribute(paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges, 'disabled');
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.backend.wc.paypalMarketplaceSettings, paymentSettingsAdmin.paypalMarketPlace.paypalMarketPlaceSaveChanges);

        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // admin setup mangopay
    async setupMangoPay(payment: payment) {
        await this.goto(data.subUrls.backend.wc.mangoPaySettings);

        // setup mangopay
        await this.check(paymentSettingsAdmin.dokanMangoPay.enableDisableMangoPayPayment);
        await this.clearAndType(paymentSettingsAdmin.dokanMangoPay.title, payment.mangoPay.title);
        await this.clearAndType(paymentSettingsAdmin.dokanMangoPay.description, payment.mangoPay.description);
        // api credentials
        await this.check(paymentSettingsAdmin.dokanMangoPay.mangoPaySandbox);
        await this.clearAndType(paymentSettingsAdmin.dokanMangoPay.sandboxClientId, payment.mangoPay.sandboxClientId);
        await this.clearAndType(paymentSettingsAdmin.dokanMangoPay.sandBoxApiKey, payment.mangoPay.sandBoxApiKey);
        // payment options
        const isCardExists = await this.isLocatorExists(paymentSettingsAdmin.dokanMangoPay.currentAvailableCreditCards(payment.mangoPay.availableCreditCards));
        if (!isCardExists) {
            await this.click(paymentSettingsAdmin.dokanMangoPay.chooseAvailableCreditCards);
            await this.type(paymentSettingsAdmin.dokanMangoPay.chooseAvailableCreditCards, payment.mangoPay.availableCreditCards);
            await this.click(paymentSettingsAdmin.dokanMangoPay.searchedResult);
        }
        // await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanMangoPay.chooseAvailableCreditCardsValues, payment.mangoPay.availableCreditCards);
        const isServiceExists = await this.isLocatorExists(paymentSettingsAdmin.dokanMangoPay.currentPaymentServices(payment.mangoPay.availableCreditCards));
        if (!isServiceExists) {
            await this.click(paymentSettingsAdmin.dokanMangoPay.chooseAvailableDirectPaymentServices);
            await this.type(paymentSettingsAdmin.dokanMangoPay.chooseAvailableDirectPaymentServices, payment.mangoPay.availableDirectPaymentServices);
            await this.click(paymentSettingsAdmin.dokanMangoPay.searchedResult);
        }
        // await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanMangoPay.chooseAvailableDirectPaymentServicesValues, payment.mangoPay.availableDirectPaymentServices);
        await this.check(paymentSettingsAdmin.dokanMangoPay.savedCards);
        // Fund Transfers and Payouts
        await this.click(paymentSettingsAdmin.dokanMangoPay.transferFunds);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanMangoPay.transferFundsValues, payment.mangoPay.transferFunds);
        await this.check(paymentSettingsAdmin.dokanMangoPay.payoutMode);
        // Types and Requirements of Vendors
        await this.click(paymentSettingsAdmin.dokanMangoPay.typeOfVendors);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanMangoPay.typeOfVendorsValues, payment.mangoPay.typeOfVendors);
        await this.click(paymentSettingsAdmin.dokanMangoPay.businessRequirement);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanMangoPay.businessRequirementValues, payment.mangoPay.businessRequirement);
        // advanced settings
        await this.check(paymentSettingsAdmin.dokanMangoPay.displayNoticeToNonConnectedSellers);
        await this.check(paymentSettingsAdmin.dokanMangoPay.sendAnnouncementToNonConnectedSellers);
        await this.clearAndType(paymentSettingsAdmin.dokanMangoPay.announcementInterval, payment.mangoPay.announcementInterval);

        await this.removeAttribute(paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges, 'disabled');
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.backend.wc.mangoPaySettings, paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges);

        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // admin setup razorpay
    async setupRazorpay(payment: payment) {
        await this.goto(data.subUrls.backend.wc.razorPaySettings);

        // setup razorpay
        await this.check(paymentSettingsAdmin.dokanRazorpay.enableDisableDokanRazorpay);
        await this.clearAndType(paymentSettingsAdmin.dokanRazorpay.title, payment.razorPay.title);
        await this.clearAndType(paymentSettingsAdmin.dokanRazorpay.description, payment.razorPay.description);
        // api credentials
        await this.check(paymentSettingsAdmin.dokanRazorpay.razorpaySandbox);
        await this.clearAndType(paymentSettingsAdmin.dokanRazorpay.testKeyId, payment.razorPay.testKeyId);
        await this.clearAndType(paymentSettingsAdmin.dokanRazorpay.testKeySecret, payment.razorPay.testKeySecret);
        await this.click(paymentSettingsAdmin.dokanRazorpay.disbursementMode);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.dokanRazorpay.disbursementModeValues, payment.razorPay.disbursementMode);
        await this.check(paymentSettingsAdmin.dokanRazorpay.sellerPaysTheProcessingFee);
        await this.check(paymentSettingsAdmin.dokanRazorpay.displayNoticeToConnectSeller);
        await this.check(paymentSettingsAdmin.dokanRazorpay.sendAnnouncementToConnectSeller);
        await this.clearAndType(paymentSettingsAdmin.dokanRazorpay.sendAnnouncementInterval, payment.razorPay.announcementInterval);
        await this.removeAttribute(paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges, 'disabled');
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.backend.wc.razorPaySettings, paymentSettingsAdmin.dokanRazorpay.dokanRazorpaySaveChanges);

        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // admin setup stripe express
    async setupStripeExpress(payment: payment) {
        await this.goto(data.subUrls.backend.wc.stripeExpressSettings);

        // stripe express
        await this.check(paymentSettingsAdmin.stripeExpress.enableOrDisableStripeExpress);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.title, payment.stripeExpress.title);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.description, payment.stripeExpress.description);
        // api credentials
        await this.check(paymentSettingsAdmin.stripeExpress.testMode);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.testPublishableKey, payment.stripeExpress.testPublishableKey);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.testSecretKey, payment.stripeExpress.testSecretKey);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.testWebhookSecret, payment.stripeExpress.testWebhookSecret);
        // payment and disbursement
        await this.click(paymentSettingsAdmin.stripeExpress.choosePaymentMethods);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.stripeExpress.choosePaymentMethodsValues, payment.stripeExpress.paymentMethods.card);
        await this.click(paymentSettingsAdmin.stripeExpress.choosePaymentMethods);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.stripeExpress.choosePaymentMethodsValues, payment.stripeExpress.paymentMethods.ideal);
        await this.check(paymentSettingsAdmin.stripeExpress.takeProcessingFeesFromSellers);
        await this.check(paymentSettingsAdmin.stripeExpress.savedCards);
        await this.check(paymentSettingsAdmin.stripeExpress.capturePaymentsManually);
        await this.click(paymentSettingsAdmin.stripeExpress.disburseFunds);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.stripeExpress.disbursementModeValues, payment.stripeExpress.disbursementMode);
        await this.clearAndType(paymentSettingsAdmin.stripeExpress.customerBankStatement, payment.stripeExpress.customerBankStatement);
        // payment request options (Apple Pay/Google Pay)
        await this.check(paymentSettingsAdmin.stripeExpress.paymentRequestButtons);
        await this.selectByValue(paymentSettingsAdmin.stripeExpress.buttonType, payment.stripeExpress.paymentRequestButtonType);
        await this.selectByValue(paymentSettingsAdmin.stripeExpress.buttonTheme, payment.stripeExpress.paymentRequestButtonTheme);
        await this.click(paymentSettingsAdmin.stripeExpress.buttonLocations);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.stripeExpress.buttonLocationsValues, payment.stripeExpress.paymentRequestButtonLocation.product);
        await this.click(paymentSettingsAdmin.stripeExpress.buttonLocations);
        await this.setDropdownOptionSpan(paymentSettingsAdmin.stripeExpress.buttonLocationsValues, payment.stripeExpress.paymentRequestButtonLocation.cart);
        // advanced settings
        await this.check(paymentSettingsAdmin.stripeExpress.displayNoticeToNonConnectedSellers);
        await this.check(paymentSettingsAdmin.stripeExpress.sendAnnouncementToNonConnectedSellers);
        await this.type(paymentSettingsAdmin.stripeExpress.announcementInterval, payment.stripeExpress.announcementInterval);
        await this.check(paymentSettingsAdmin.stripeExpress.debugLog);
        await this.removeAttribute(paymentSettingsAdmin.dokanMangoPay.dokanMangopaySaveChanges, 'disabled');
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.backend.wc.stripeExpressSettings, paymentSettingsAdmin.stripeExpress.stripeExpressSaveChanges);

        await this.toContainText(woocommerceSettings.updatedSuccessMessage, payment.saveSuccessMessage);
    }

    // vendor

    // payment settings render properly
    async vendorPaymentSettingsRenderProperly(): Promise<void> {
        await this.goIfNotThere(data.subUrls.frontend.vDashboard.settingsPayment);

        // paymentMethod text is visible
        await this.toBeVisible(paymentSettingsVendor.paymentMethodText);

        // paymentMethods summary div is visible
        await this.toBeVisible(paymentSettingsVendor.paymentMethods.paymentMethodsDiv);
        // paymentMethods dropdown is visible
        await this.toBeVisible(paymentSettingsVendor.paymentMethods.addPaymentMethodDropDown);

        // await this.notToHaveCount(paymentSettingsVendor.paymentMethods.noOfPaymentMethods, 0);
    }

    // goto payment settings
    async goToPaymentSettings(methodName: string): Promise<void> {
        switch (methodName) {
            case 'paypal':
                await this.goto(data.subUrls.frontend.vDashboard.paypal);
                break;

            case 'bank':
                await this.goto(data.subUrls.frontend.vDashboard.bankTransfer);
                break;

            case 'skrill':
                await this.goto(data.subUrls.frontend.vDashboard.skrill);
                break;

            case 'custom':
                await this.goto(data.subUrls.frontend.vDashboard.customPayment);
                break;

            default:
                break;
        }
    }

    // set basic payment method [paypal, skrill, custom ]
    async addBasicPayment(paymentMethod: vendor['payment']): Promise<void> {
        await this.goToPaymentSettings(paymentMethod.methodName);
        await this.clearAndType(paymentSettingsVendor.paymentEmail, paymentMethod.email());
        await this.clickAndWaitForResponse(data.subUrls.ajax, paymentSettingsVendor.updateSettings);
        await this.toContainText(paymentSettingsVendor.updateSettingsSuccessMessage, paymentMethod.saveSuccessMessage);
    }

    // disconnect basic payment method [paypal, skrill, custom ]
    async removeBasicPayment(paymentMethod: vendor['payment']): Promise<void> {
        await this.goToPaymentSettings(paymentMethod.methodName);
        await this.clickAndWaitForResponse(data.subUrls.ajax, paymentSettingsVendor.disconnectPayment);
        await this.toContainText(paymentSettingsVendor.updateSettingsSuccessMessage, paymentMethod.saveSuccessMessage);
    }

    // bank transfer payment settings
    async addBankTransfer(paymentMethod: vendor['payment']): Promise<void> {
        await this.goIfNotThere(data.subUrls.frontend.vDashboard.bankTransfer);

        // await this.clickIfVisible(paymentSettingsVendor.disconnectAccount);
        await this.clearAndType(paymentSettingsVendor.bankAccountName, paymentMethod.bankAccountName);
        await this.selectByValue(paymentSettingsVendor.bankAccountType, paymentMethod.bankAccountType);
        await this.clearAndType(paymentSettingsVendor.bankAccountNumber, paymentMethod.bankAccountNumber);
        await this.clearAndType(paymentSettingsVendor.bankRoutingNumber, paymentMethod.bankRoutingNumber);
        await this.clearAndType(paymentSettingsVendor.bankName, paymentMethod.bankName);
        await this.clearAndType(paymentSettingsVendor.bankAddress, paymentMethod.bankAddress);
        await this.clearAndType(paymentSettingsVendor.bankIban, paymentMethod.bankIban);
        await this.clearAndType(paymentSettingsVendor.bankSwiftCode, paymentMethod.bankSwiftCode);
        await this.check(selector.vendor.vSetup.declaration);

        await this.clickAndWaitForResponse(data.subUrls.ajax, paymentSettingsVendor.addAccount);
        await this.toContainText(paymentSettingsVendor.updateSettingsSuccessMessage, paymentMethod.saveSuccessMessage);
    }
}
