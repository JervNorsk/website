with(rootProject) {
    name = "jn-website-frontend"
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}

pluginManagement {
    resolutionStrategy {
        plugins {
            // Kotlin
            // ----------------------------------------------------------------
            kotlin("multiplatform") version(extra["kotlin.version"] as String)

            // Kotlin Plugins
            // ----------------------------------------------------------------
            kotlin("plugin.serialization") version(extra["kotlin.version"] as String)

            // Analytics
            // ------------------------------------------------------------------------
            id("com.appland.appmap") version(extra["appmap.version"] as String)
        }
    }
}
