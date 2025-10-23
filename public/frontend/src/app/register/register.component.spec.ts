import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from "./register.component";
import { User, UsersDataService } from '../users-data.service';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';
import { environment } from '../../environments/environment';
import { ErrorResponse, Response } from '../reponse';

// Mock classes for services
class MockAuthService {
    isLoggedIn = false;
}

class MockUsersDataService {
    register(user: User) {
        return of({ success: true, message: 'User registered successfully', data: {} });
    }
}

class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

class MockToastService {
    open = jasmine.createSpy('open')
}


describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authService: MockAuthService;
    let usersDataService: MockUsersDataService;
    let router: MockRouter;
    let toastService: MockToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterComponent], // Standalone
            providers: [
                { provide: AuthService, useClass: MockAuthService },
                { provide: UsersDataService, useClass: MockUsersDataService },
                { provide: Router, useClass: MockRouter },
                { provide: ToastService, useClass: MockToastService },
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;

        // Get service instances
        authService = TestBed.inject(AuthService) as unknown as MockAuthService;
        usersDataService = TestBed.inject(UsersDataService) as unknown as MockUsersDataService;
        router = TestBed.inject(Router) as unknown as MockRouter;
        toastService = TestBed.inject(ToastService) as unknown as MockToastService;

        fixture.detectChanges()
    })

    describe('Component Creation', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with correct routes', () => {
            expect(component.routes).toEqual(environment.ROUTES);
        });

        it('should initialize with button enabled', () => {
            expect(component.isButtonDisabled).toBeFalse();
        })
    })

    describe('ngOnInit', () => {
        it('should navigate to home if user is already logged in', () => {
            // Arrange
            authService.isLoggedIn = true;

            // Act
            component.ngOnInit();

            // Assert
            expect(router.navigate).toHaveBeenCalledWith([environment.ROUTES.HOME]);
        })
    })

    describe('register', () => {
        beforeEach(() => {
            // Initialize the form before each test
            component.registerForm = {
                invalid: false,
                value: {
                    username: 'testuser',
                    name: 'test',
                    password: 'password123',
                    confirmPassword: 'password123',
                },
                control: {
                    markAllAsTouched: jasmine.createSpy('markAllAsTouched')
                },
                reset: jasmine.createSpy('reset')
            } as any
        });

        it('should not call API when form is invalid', () => {
            // Arrange
            (component.registerForm as any).invalid = true;
            spyOn(component, '_callRegisterApi');
            // Act
            component.register();
            // Assert
            expect(component.registerForm.control.markAllAsTouched).toHaveBeenCalled();
            expect(component._callRegisterApi).not.toHaveBeenCalled();
        })

        it('should call API when form is valid', () => {
            // Arrange
            (component.registerForm as any).invalid = false;
            spyOn(component, '_callRegisterApi');
            // Act
            component.register();
            // Assert
            expect(component._callRegisterApi).toHaveBeenCalledWith({
                username: 'testuser',
                name: 'test',
                password: 'password123'
            });
        })

        it('should disable button when form is submitted', () => {
            // Arrange
            (component.registerForm as any).invalid = false;

            // Act
            component.register();

            // Assert
            expect(component.isButtonDisabled).toBeFalse();
        });
    })

    describe('_callRegisterApi', () => {
        it('should call usersDataService.register with user data', () => {
            // Arrange
            const userData: User = {
                username: 'testuser',
                name: 'user',
                password: 'admin123'
            }

            spyOn(usersDataService, 'register').and.returnValue(of({
                success: true,
                message: 'User registered successfully',
                data: {}
            }))

            // Act
            component._callRegisterApi(userData);

            // Assert
            expect(usersDataService.register).toHaveBeenCalledWith(userData);
        });

        it('should handle successful registration', () => {
            // Arrange
            const userData: User = {
                username: 'testuser',
                name: 'test',
                password: 'password123'
            };

            spyOn(usersDataService, 'register').and.returnValue(of({
                success: true,
                message: 'User registered successfully',
                data: {}
            }));

            spyOn(component, '_handleRegiterApiSuccess');
            spyOn(component, '_enablingButton');

            // Act
            component._callRegisterApi(userData);

            // Assert
            expect(component._handleRegiterApiSuccess).toHaveBeenCalled();
        });

        it('should handle registration error', () => {
            // Arrange
            const userData: User = {
                username: 'testuser',
                name: 'test',
                password: 'password123'
            };

            const errorResponse: ErrorResponse<any> = {
                error: { message: 'Registration failed' }
            } as any;

            spyOn(usersDataService, 'register').and.returnValue(throwError(() => errorResponse));
            spyOn(component, '_handleApiError');
            spyOn(component, '_enablingButton');

            // Act
            component._callRegisterApi(userData);

            // Assert
            expect(component._handleApiError).toHaveBeenCalledWith(errorResponse);
        });
    })

    describe('_handleRegiterApiSuccess', () => {
        it('should reset form and show success toast', () => {
            // Arrange
            const response: Response<any> = {
                status: 200,
                message: 'User registered successfully',
                data: []
            };

            spyOn(component, '_resetRegistrationForm');

            // Act
            component._handleRegiterApiSuccess(response);

            // Assert
            expect(component._resetRegistrationForm).toHaveBeenCalled();
            expect(toastService.open).toHaveBeenCalledWith({
                type: MESSAGE_TYPE.SUCCESS,
                message: 'User registered successfully'
            });
        });
    });

    describe('_handleApiError', () => {
        it('should show error toast with error message', () => {
            // Arrange
            const errorResponse: ErrorResponse<any> = {
                error: { message: 'Registration failed' }
            } as any;

            // Act
            component._handleApiError(errorResponse);

            // Assert
            expect(toastService.open).toHaveBeenCalledWith({
                type: MESSAGE_TYPE.ERROR,
                message: 'Registration failed'
            });
        });
    });


    describe('_resetRegistrationForm', () => {
        it('should reset the registration form', () => {
            // Arrange
            component.registerForm = {
                reset: jasmine.createSpy('reset')
            } as any;

            // Act
            component._resetRegistrationForm();

            // Assert
            expect(component.registerForm.reset).toHaveBeenCalled();
        })
    })

    describe('_enablingButton', () => {
        it('should enable the button', () => {
            // Arrange
            component.isButtonDisabled = true;
            // Act
            component._enablingButton();
            // Assert
            expect(component.isButtonDisabled).toBeFalse();
        })
    })
})