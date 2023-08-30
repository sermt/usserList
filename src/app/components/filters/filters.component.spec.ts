import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FiltersComponent } from './filters.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { Filter } from 'src/app/services/types';
import { ReactiveFormsModule } from '@angular/forms';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      imports: [NoopAnimationsModule,ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a mat-form-field element with the correct class', async () => {
    const formFieldHarness = await loader.getHarness(MatFormFieldHarness);
    expect(await formFieldHarness.getLabel()).toBe('Filter by:');
  });

  it('should update filterControl value when selecting a filterr', async () => {
    const selectHarness = await loader.getHarness(MatSelectHarness);
    const filterToSelect = 'Name';

    await selectHarness.open();
    const optionHarnesses = await selectHarness.getOptions();
    const optionTexts = await Promise.all(optionHarnesses.map(option => option.getText()));
    const optionIndex = optionTexts.findIndex(text => text === filterToSelect);
    if (optionIndex !== -1) {
      await optionHarnesses[optionIndex].click();
    }

    expect(await selectHarness.getValueText()).toEqual(filterToSelect as Filter);
  });

  it('should emit filterChanged events when selecting different filters', async () => {
    const spy = spyOn(component.filterChanged, 'emit');

    const selectHarness = await loader.getHarness(MatSelectHarness);
    const filterToSelect = 'Name';

    await selectHarness.open();
    const optionHarnesses = await selectHarness.getOptions();
    const optionTexts = await Promise.all(optionHarnesses.map(option => option.getText()));
    const optionIndex = optionTexts.findIndex(text => text === filterToSelect);
    if (optionIndex !== -1) {
      await optionHarnesses[optionIndex].click();
    }

    expect(spy).toHaveBeenCalledOnceWith('Name' as Filter);
  });
});
