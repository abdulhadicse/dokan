import { Page, expect } from '@playwright/test';
import { BasePage } from '@pages/basePage';
import { selector } from '@pages/selectors';
import { data } from '@utils/testData';

// selectors
const settingsAdmin = selector.admin.dokan.settings;
const vendorDashboard = selector.vendor.vDashboard;

export class MenuManagerPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // navigation
    async goToMenuManagerSettings() {
        await this.goIfNotThere(data.subUrls.backend.dokan.settings);
        await this.click(settingsAdmin.menus.menuManager);
    }

    // save settings
    async saveSettings() {
        await this.toContainText(settingsAdmin.dokanUpdateSuccessMessage, 'Setting has been saved successfully.');
    }

    // update menu status
    async updateMenuStatus(menu: string, action: string, menuLink: string) {
        await this.gotoUntilNetworkidle(data.subUrls.backend.dokan.settings, { waitUntil: 'networkidle' }, true);
        await this.click(settingsAdmin.menus.menuManager);

        switch (action) {
            case 'activate':
                await this.enableSwitcher(settingsAdmin.menuManager.menuSwitcher(menu));
                await this.clickAndWaitForResponseAndLoadStateUntilNetworkIdle(data.subUrls.ajax, settingsAdmin.saveChanges);
                await this.toHaveBackgroundColor(settingsAdmin.menuManager.menuSwitcher(menu) + '//span', 'rgb(0, 144, 255)');
                //assertion
                await this.goto(data.subUrls.frontend.vDashboard.dashboard);
                await this.toBeVisible((vendorDashboard.menus.primary as any)[menuLink]);
                await this.goto((data.subUrls.frontend.vDashboard as any)[menuLink]);
                await this.notToBeVisible(settingsAdmin.menuManager.noPermissionNotice);
                break;

            case 'deactivate':
                await this.disableSwitcher(settingsAdmin.menuManager.menuSwitcher(menu));
                await this.clickAndWaitForResponseAndLoadStateUntilNetworkIdle(data.subUrls.ajax, settingsAdmin.saveChanges);
                await this.toHaveBackgroundColor(settingsAdmin.menuManager.menuSwitcher(menu) + '//span', 'rgb(215, 218, 221)');
                //assertion
                await this.goto(data.subUrls.frontend.vDashboard.dashboard);
                await this.notToBeVisible((vendorDashboard.menus.primary as any)[menuLink]);
                await this.goto((data.subUrls.frontend.vDashboard as any)[menuLink]);
                await this.toBeVisible(settingsAdmin.menuManager.noPermissionNotice);
                break;

            default:
                break;
        }
    }

    // rename menu
    async renameMenu(currentMenu: string, newMenu: string) {
        await this.goToMenuManagerSettings();

        //rename
        await this.click(settingsAdmin.menuManager.menuEdit(currentMenu));
        await this.clearAndType(settingsAdmin.menuManager.menuNameInput, newMenu);
        await this.click(settingsAdmin.menuManager.menuNameConfirm);
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);
        await this.toBeVisible(settingsAdmin.menuManager.menuEdit(newMenu));

        await this.goto(data.subUrls.frontend.vDashboard.dashboard);
        await this.toBeVisible(vendorDashboard.menus.menuByText(newMenu));
    }

    async cantRenameMenuBeyondLimit(currentMenu: string, newMenu: string) {
        await this.goToMenuManagerSettings();

        //rename
        await this.click(settingsAdmin.menuManager.menuEdit(currentMenu));
        await this.clearAndType(settingsAdmin.menuManager.menuNameInput, newMenu);
        await this.toHaveAttribute(settingsAdmin.menuManager.menuNameInput, 'maxlength', '45');
        await this.click(settingsAdmin.menuManager.menuNameConfirm);
        // await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.menuManager.menuManagerSaveChanges);
        await this.toBeVisible(settingsAdmin.menuManager.menuEdit(newMenu.substring(0, 45)));
        await this.notToBeVisible(settingsAdmin.menuManager.menuEdit(newMenu));
    }

    async cantRenameMenu(menu: string) {
        await this.goToMenuManagerSettings();
        await this.disableSwitcher(settingsAdmin.menuManager.menuSwitcher(menu));
        await this.notToBeVisible(settingsAdmin.menuManager.menuEdit(menu));
    }

    // dashboard cant be altered
    async cantAlterMenu(menu: string, isSubmenu?: boolean) {
        await this.goToMenuManagerSettings();
        if (isSubmenu) await this.click(settingsAdmin.menuManager.settingsSubMenu);

        await this.hasClass(settingsAdmin.menuManager.menuGrabber(menu), 'not-sortable');
        await this.notToBeVisible(settingsAdmin.menuManager.menuSwitcher(menu));
    }

    // reorderMenu
    async reorderMenu(source: string, target: string) {
        await this.goToMenuManagerSettings();
        const initialSourceIndex = await this.getLocatorIndex(settingsAdmin.menuManager.menuParent, settingsAdmin.menuManager.menuGrabber(source));
        const initialTargetIndex = await this.getLocatorIndex(settingsAdmin.menuManager.menuParent, settingsAdmin.menuManager.menuGrabber(target));

        await this.dragToTargetLocator(settingsAdmin.menuManager.menuGrabber(source), settingsAdmin.menuManager.menuGrabber(target));
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);

        const newSourceIndex = await this.getLocatorIndex(settingsAdmin.menuManager.menuParent, settingsAdmin.menuManager.menuGrabber(source));
        const newTargetIndex = await this.getLocatorIndex(settingsAdmin.menuManager.menuParent, settingsAdmin.menuManager.menuGrabber(target));

        expect(newSourceIndex).toEqual(initialTargetIndex);
        expect(newTargetIndex).toEqual(initialSourceIndex);

        await this.goto(data.subUrls.frontend.vDashboard.dashboard);
        const sourceIndexDashboard = await this.getLocatorIndex(vendorDashboard.menuParent, vendorDashboard.menus.menuByText(source) + '/..');
        const targetIndexDashboard = await this.getLocatorIndex(vendorDashboard.menuParent, vendorDashboard.menus.menuByText(target) + '/..');

        expect(sourceIndexDashboard).toEqual(newSourceIndex);
        expect(targetIndexDashboard).toEqual(newTargetIndex);
    }

    // reset menu manager settings
    async resetMenuManagerSettings(menu: string) {
        await this.goToMenuManagerSettings();

        // reset
        await this.click(settingsAdmin.menuManager.resetAll);
        await this.click(settingsAdmin.menuManager.confirmReset);
        await this.clickAndWaitForResponseAndLoadState(data.subUrls.ajax, settingsAdmin.saveChanges);

        await this.toHaveBackgroundColor(settingsAdmin.menuManager.menuSwitcher(menu) + '//span', 'rgb(0, 144, 255)');
    }
}
