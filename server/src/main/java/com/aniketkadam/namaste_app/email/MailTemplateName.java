package com.aniketkadam.namaste_app.email;

import lombok.Getter;

@Getter
public enum MailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    FORGOT_PASSWORD("forgot_password"),
            ;
    private final String name;

    MailTemplateName(String name) {
        this.name = name;
    }
}
