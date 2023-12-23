import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoKeyComponent } from './cryptoKey.component';

describe('EditorComponent', () => {
  let component: CryptoKeyComponent;
  let fixture: ComponentFixture<CryptoKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoKeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
