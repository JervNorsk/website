import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    // Kotlin
    // ------------------------------------------------------------------------
    kotlin("multiplatform")

    // Kotlin Plugins
    // ------------------------------------------------------------------------
    kotlin("plugin.serialization")

    // Analytics
    // ------------------------------------------------------------------------
    id("com.appland.appmap")
}

kotlin {
    js {
        nodejs()
    }
    sourceSets {
        val jsMain by getting {
            kotlin.srcDir("src/jsMain/typescript")
        }
    }
}
