import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchResultsComponent } from './search-results.component';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { SearchResultsService } from '../search-results.service';
import { of } from 'rxjs';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let userService: UserService;
  let adminService: AdminService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SearchResultsComponent
      ],
      providers: [
        UserService,
        AdminService,
        {
          provide: SearchResultsService,
          useValue: {
            hotels$: of([]),
            isLoading$: of(false),
            fetchHotelsByCity: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    adminService = TestBed.inject(AdminService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Authentication Status', () => {
    it('should set isLoggedIn to true and userRole to "user" if role is in localStorage', () => {
      localStorage.setItem('role', 'user');
      component.checkUserStatus();
      expect(component.isLoggedIn).toBe(true);
      expect(component.userRole).toBe('user');
      localStorage.removeItem('role');
    });

    it('should set isLoggedIn to true and userRole to "admin" if role is in localStorage', () => {
      localStorage.setItem('role', 'admin');
      component.checkUserStatus();
      expect(component.isLoggedIn).toBe(true);
      expect(component.userRole).toBe('admin');
      localStorage.removeItem('role');
    });

    it('should set isLoggedIn to false and userRole to null if role is not in localStorage', () => {
      localStorage.removeItem('role');
      component.checkUserStatus();
      expect(component.isLoggedIn).toBe(false);
      expect(component.userRole).toBe(null);
    });
  });

  describe('Modal Control', () => {
    it('should open the login modal', () => {
      component.openLoginModal();
      expect(component.isLoginModalOpen).toBe(true);
      expect(component.isRegisterModalOpen).toBe(false);
    });

    it('should open the register modal', () => {
      component.openRegisterModal();
      expect(component.isRegisterModalOpen).toBe(true);
      expect(component.isLoginModalOpen).toBe(false);
    });

    it('should close the login modal', () => {
      component.isLoginModalOpen = true;
      component.closeLoginModal();
      expect(component.isLoginModalOpen).toBe(false);
    });

    it('should close the register modal', () => {
      component.isRegisterModalOpen = true;
      component.closeRegisterModal();
      expect(component.isRegisterModalOpen).toBe(false);
    });
  });
});
