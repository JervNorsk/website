import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    // Kotlin
    // ------------------------------------------------------------------------
    kotlin("multiplatform")

    // Kotlin Plugins
    // ------------------------------------------------------------------------
    kotlin("plugin.serialization")
    kotlin("plugin.spring")

    // Spring
    // ------------------------------------------------------------------------
    id("org.springframework.boot")
    id("io.spring.dependency-management")

    // Analytics
    // ------------------------------------------------------------------------
    id("com.appland.appmap")
}

kotlin {
    jvm {
        withJava()
        tasks.withType<KotlinCompile> {}
        tasks.withType<Test> {
            useJUnitPlatform()
        }
    }
    sourceSets {
        val jvmMain by getting {
            dependencies {
                // Kotlin
                // ------------------------------------------------------------
                implementation(kotlin("reflect"))

                // Kotlin Extensions
                // ------------------------------------------------------------
                implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

                // Spring
                // ------------------------------------------------------------
                implementation("org.springframework.boot:spring-boot-starter-actuator")
                implementation("org.springframework.boot:spring-boot-starter-webflux")

                // Spring Extensions
                // ------------------------------------------------------------
                implementation("org.springframework.boot:spring-boot-devtools")
            }
        }
        val jvmTest by getting {
            dependencies {
                // Spring
                // ------------------------------------------------------------
                implementation("org.springframework.boot:spring-boot-starter-test")
            }
        }
    }
}
