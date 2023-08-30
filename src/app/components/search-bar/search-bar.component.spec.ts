import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements and attributes
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search term when performSearch is called with a non-empty searchFormControl', () => {
    const searchTerm = 'test search';
    component.searchFormControl.setValue(searchTerm);
    spyOn(component.searchChanged, 'emit');

    component.performSearch();

    expect(component.searchChanged.emit).toHaveBeenCalledWith(searchTerm);
  });

  it('should not emit search term when performSearch is called with an empty searchFormControl', () => {
    component.searchFormControl.setValue('');
    spyOn(component.searchChanged, 'emit');

    component.performSearch();

    expect(component.searchChanged.emit).not.toHaveBeenCalled();
  });

  it('should trim search term before emitting', () => {
    const searchTerm = '  test search  ';
    const trimmedSearchTerm = 'test search';
    component.searchFormControl.setValue(searchTerm);
    spyOn(component.searchChanged, 'emit');

    component.performSearch();

    expect(component.searchChanged.emit).toHaveBeenCalledWith(trimmedSearchTerm);
  });

  it('should render input element', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement).toBeTruthy();
  });

});
