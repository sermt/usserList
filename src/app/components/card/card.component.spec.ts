import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { CardComponent } from './card.component';
import { MatCardModule } from '@angular/material/card';
import { User } from 'src/app/models/user.model';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let loader: HarnessLoader;
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'path/to/avatar.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name in card title', async () => {
    const cardHarness = await loader.getHarness(MatCardHarness);
    const cardTitle = await cardHarness.getTitleText();

    expect(cardTitle).toContain(mockUser.name);
  });

  it('should display user email in card subtitle', async () => {
    const cardHarness = await loader.getHarness(MatCardHarness);
    const cardSubtitle = await cardHarness.getSubtitleText();

    expect(cardSubtitle).toContain(mockUser.email);
  });

  it('should display user avatar', async () => {
    const cardAvatarImg = fixture.debugElement.query(By.css('.avatar-container img')).nativeElement;
    const cardAvatarSrc = cardAvatarImg.getAttribute('src');

    expect(cardAvatarSrc).toBe(mockUser.avatar);
  });

  it('should have correct avatar alt text', async () => {
    const cardAvatarImg = fixture.debugElement.query(By.css('.avatar-container img')).nativeElement;
    const cardAvatarAlt = cardAvatarImg.getAttribute('alt');

    expect(cardAvatarAlt).toBe(`${mockUser.name}'s Picture`);
  });
});
