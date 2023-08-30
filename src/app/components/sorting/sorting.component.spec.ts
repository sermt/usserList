import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { SortingComponent } from './sorting.component';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Order, Params, Sort } from '../../services/types';

describe('SortingComponent', () => {
  let component: SortingComponent;
  let fixture: ComponentFixture<SortingComponent>;
  let loader: HarnessLoader;
  const mockParamsAsc: Params = { sortBy: Sort.Name, orderBy: Order.Ascending };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortingComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatIconModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SortingComponent);
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

  it('should emit sortingChanged event when selecting sorting option', async () => {
    const spy = spyOn(component.sortingChanged, 'emit');
    const selectHarness = await loader.getHarness(MatSelectHarness);
    const sortingToSelect = 'Name';

    await selectHarness.open();
    const optionHarnesses = await selectHarness.getOptions();
    const optionTexts = await Promise.all(
      optionHarnesses.map((option) => option.getText())
    );
    const optionIndex = optionTexts.findIndex(
      (text) => text === sortingToSelect
    );
    if (optionIndex !== -1) {
      await optionHarnesses[optionIndex].click();
    }
    expect(spy).toHaveBeenCalledOnceWith(mockParamsAsc);
  });

  it('should emit sortingChanged event when toggling sort order', async () => {
    const spy = spyOn(component.sortingChanged, 'emit');
    const selectHarness = await loader.getHarness(MatSelectHarness);
    const sortingToSelect = 'Name';

    await selectHarness.open();
    const optionHarnesses = await selectHarness.getOptions();
    const optionTexts = await Promise.all(
      optionHarnesses.map((option) => option.getText())
    );
    const optionIndex = optionTexts.findIndex(
      (text) => text === sortingToSelect
    );
    if (optionIndex !== -1) {
      await optionHarnesses[optionIndex].click();
    }

    component.toggleSortOrder();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(mockParamsAsc);
  });
});
