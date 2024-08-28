export const environment = {
    BASE_URL: "http://localhost:3000",
    BASE_API_URL: "http://localhost:3000/api",
    APP_TITLE: "Set Dev Art",
    ROUTES: {
        HOME: "/home",
        USERS: "/users",
        LOGIN: "/login",
        ARTICLES: "/articles",
        COMMENTS: "/comments",
        POST: "/post",
        REGISTER: "/register",
        CREATE_POST: "/create-post",
        EDIT_POST: "/edit-post",
        EDIT_COMMENT: "/edit-comment",
        UPLOAD: "/upload",
        IMAGE: "/image"
    },
    ROUTE_PATHS: {
        HOME: "home",
        REGISTER: "register",
        LOGIN: "login",
        CREATE_POST: "create-post",
        EDIT_POST: "edit-post",
        SINGLE_POST: "post/:postId",
        EDIT_COMMENT: "edit-comment",
        ERROR_PAGE: "**"
    },
    LOCAL_STORAGE: {
        USER: "user"
    },
    REQUEST_HEADER: {
        AUTHORIZATION: "Authorization",
        BEARER: "Bearer"
    },
    ROUTER_STATES: {
        COMMENT: "comment",
        ARTICLE: "article",
        ACTION: "action"
    },
    MESSAGES : {
        SOMETHING_WENT_WRONG: "Something went wrong.",
        CANNOT_ACCESS_THE_PAGE_LOGIN: "Cannot access this page while your are logged in.",
        NO_CHANGES_MADE: "You need to make some changes before submitting the form.",
        ACCESS_DENIED: "Access denied!!!"      
    },
    COMMENT_FORM: {
        NAME: "name",
        COMMENT: "comment"
    },
    ARTICLE_FORM: {
        TITLE: "title",
        AUTHOR: "author",
        LINK: "link",
        IMAGE_LINK: "imageLink",
    },
    VALIDATORS: {
        MIN_LENGTH_3: 3,
        MIN_LENGTH_5: 5,
    },
    DROPDOWN_CONFIG_ACTION_NAME: {
        FULLY_EDIT: "Fully Edit",
        PARTIAL_EDIT: "Partial Edit",
        DELETE: "Delete"
    },
    PARAMS: {
        POST_ID: "postId"
    },
    INITIAL_ARTICLE_COUNT: 5
};
