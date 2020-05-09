import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';

import {
    MAT_DIALOG_DATA,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDialogRef,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';

import {
    MAT_DATETIME_FORMATS,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
} from '@mat-datetimepicker/core';

@NgModule({
    imports: [
        CdkTableModule,

        MatAutocompleteModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,

        MatDatetimepickerModule,
        MatNativeDatetimeModule,

        BrowserAnimationsModule,
    ],
    exports: [
        CdkTableModule,

        MatAutocompleteModule,
        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,

        MatDatetimepickerModule,
        MatNativeDatetimeModule,

        BrowserAnimationsModule,
    ],
    providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
        MatNativeDateModule,
        MatNativeDatetimeModule,
        MatDatetimepickerModule,
        {
            provide: MAT_DATETIME_FORMATS,
            useValue: {
                parse: {},
                display: {
                    dateInput: {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    },
                    monthInput: {month: 'long'},
                    datetimeInput: {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    },
                    timeInput: {hour: '2-digit', minute: '2-digit'},
                    monthYearLabel: {year: 'numeric', month: 'short'},
                    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
                    monthYearA11yLabel: {year: 'numeric', month: 'long'},
                    popupHeaderDateLabel: {weekday: 'short', month: 'short', day: '2-digit'}
                }
            }
        }
    ]
})

export class MaterialModule {
}
