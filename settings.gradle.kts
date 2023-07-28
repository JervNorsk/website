//includeBuild("backend") {
//    name="${rootProject.name}-${name}"
//}
//
//includeBuild("frontend") {
//    name="${rootProject.name}-${name}"
//}

arrayOf(
    "app"
).forEach { name ->
    include(":$name")
    project(":$name").apply {
        projectDir = file("services/$name")
    }
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
            kotlin("multiplatform") version (extra["kotlin.version"] as String)

            // Kotlin Plugins
            // ----------------------------------------------------------------
            kotlin("plugin.serialization") version (extra["kotlin.version"] as String)

            // Analytics
            // ------------------------------------------------------------------------
            id("com.appland.appmap") version (extra["appmap.version"] as String)
        }
    }
}
