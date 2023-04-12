with(rootProject) {
    name = "jervnorsk-portfolio-backend"
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()
        maven {
            url = uri("https://repo.spring.io/milestone")
        }
        maven {
            url = uri("https://repo.spring.io/snapshot")
        }
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
            kotlin("plugin.spring") version(extra["kotlin.version"] as String)
            kotlin("plugin.lombok") version(extra["kotlin.version"] as String)

            // Spring
            // ----------------------------------------------------------------
            id("org.springframework.boot") version(extra["spring.version"] as String)
            id("io.spring.dependency-management") version(extra["spring.version"] as String)

            // Analytics
            // ------------------------------------------------------------------------
            id("com.appland.appmap") version(extra["appmap.version"] as String)
        }
    }
}
