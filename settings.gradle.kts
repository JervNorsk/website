with(rootProject) {
    name = "jn-website"
}

includeBuild("backend") {
    name="${rootProject.name}-${name}"
}

includeBuild("frontend") {
    name="${rootProject.name}-${name}"
}
