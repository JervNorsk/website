with(rootProject) {
    name = "jervnorsk-portfolio"
}

includeBuild("backend") {
    name="${rootProject.name}-${name}"
}

includeBuild("frontend") {
    name="${rootProject.name}-${name}"
}
