import org.gradle.plugins.ide.idea.model.IdeaLanguageLevel

plugins {
    // IDE
    // ------------------------------------------------------------------------
    id("idea")
}

idea {
    project {
        languageLevel = IdeaLanguageLevel("17")
    }
}
