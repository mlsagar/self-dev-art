
export const environment = {
    BASE_URL: "To place the base url of the application",
    BASE_API_URL: "To place the base url of the backend api",
    APP_TITLE: "Title of the application",
    ROUTES: {
        HOME: "url constant for home",
        USERS: "url constant for users",
        LOGIN: "url constant for login",
        ARTICLES: "url constant for articles",
        COMMENTS: "url constant for comments",
        POST: "url constant for post",
        REGISTER: "url constant for register",
        CREATE_POST: "url constant for create post",
        EDIT_POST: "url constant for edit post",
        EDIT_COMMENT: "url constant for edit comment",
        UPLOAD: "url constant for upload",
        IMAGE: "url constant for image"
    },
    ROUTE_PATHS: {
        HOME: "route path constant for home",
        REGISTER: "route path constant for register",
        LOGIN: "route path constant for login",
        CREATE_POST: "route path constant for create post",
        EDIT_POST: "route path constant for edit post",
        SINGLE_POST: "route path constant for single post",
        EDIT_COMMENT: "route path constant for edit comment",
        ERROR_PAGE: "route path constan for error page"
    },
    LOCAL_STORAGE: {
        USER: "user constant key to store in localstorage"
    },
    REQUEST_HEADER: {
        AUTHORIZATION: "constant value for authorization",
        BEARER: "constant value for bearer"
    },
    ROUTER_STATES: {
        COMMENT: "constant value for comment to be use with router state",
        ARTICLE: "constant value for article to be use with router state",
        ACTION: "constant value for action to be use with router state"
    },
    MESSAGES : {
        SOMETHING_WENT_WRONG: "message for something went wrong",
        CANNOT_ACCESS_THE_PAGE_LOGIN: "message for cannot access page while login",
        NO_CHANGES_MADE: "message for no changes mage in the form",
        ACCESS_DENIED: "message for access denied"
    },
    COMMENT_FORM: {
        NAME: "constant value for comment form name's property",
        COMMENT: "constant value for comment form comment's property"
    },
    ARTICLE_FORM: {
        TITLE: "constant value for artilce form title's property",
        AUTHOR: "constant value for artilce form author's property",
        LINK: "constant value for artilce form links's property",
        IMAGE_LINK: "constant value for artilce form image-links's property",
    },
    VALIDATORS: {
        MIN_LENGTH_3: 0, // "number value for min length 3"
        MIN_LENGTH_5: 0, // "number value for min length 5"
    },
    DROPDOWN_CONFIG_ACTION_NAME: {
        FULLY_EDIT: "constant value for fully edit",
        PARTIAL_EDIT: "constant value for partial edit",
        DELETE: "constant value for delete"
    },
    PARAMS: {
        POST_ID: "postId"
    },
    INITIAL_ARTICLE_COUNT: 0, //"initial value for articles count"
};
