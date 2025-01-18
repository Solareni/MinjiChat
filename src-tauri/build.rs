fn main() {
    tauri_build::build();

    let dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let dir = std::path::Path::new(&dir);

    let whisper = dir.parent().unwrap().join("whisper.cpp");

    // 执行cmake构建
    let build_dir = whisper.join("build");

    // 添加C++17标准
    let mut cmake_config = std::process::Command::new("cmake");
    cmake_config
        .arg("-B")
        .arg(&build_dir)
        .arg("-DCMAKE_CXX_STANDARD=17")
        .arg("-DCMAKE_CXX_STANDARD_REQUIRED=ON")
        .arg("-DCMAKE_CXX_EXTENSIONS=OFF");

    // 如果是Windows，启用Vulkan支持
    if cfg!(target_os = "windows") {
        cmake_config.arg("-DGGML_VULKAN=ON");
    }
    // 如果是macOS，设置最低版本要求
    if cfg!(target_os = "macos") {
        cmake_config.arg("-DCMAKE_OSX_DEPLOYMENT_TARGET=10.15");
    }

    // 执行配置
    cmake_config
        .current_dir(&whisper)
        .status()
        .expect("Failed to run cmake -B build");

    // 执行构建
    std::process::Command::new("cmake")
        .arg("--build")
        .arg(&build_dir)
        .arg("--config")
        .arg("Release")
        .current_dir(&whisper)
        .status()
        .expect("Failed to run cmake --build");

    // 复制whisper-cli到zimu_dir中
    #[cfg(target_os = "windows")]
    let whisper_cli = build_dir.join("bin/Release").join("whisper-cli.exe");

    #[cfg(not(target_os = "windows"))]
    let whisper_cli = build_dir.join("bin").join("whisper-cli");

    let assets = dir.join("assets");
    let _ = std::fs::create_dir(&assets);
    let dest = assets.join("whisper-cli");
    println!("cargo:warning=Copying whisper-cli to {}", dest.display());
    std::fs::copy(&whisper_cli, &dest).expect("Failed to copy whisper-cli");

    //
}
