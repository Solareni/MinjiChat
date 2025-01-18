use std::io::BufRead;

use anyhow::{Context, Result};
use crate::extension::whisper_cli;

fn whisper_command(
    model_path: &str, input_path: &str, language: &str, prompt: &str) -> Result<()> {
    let cli = whisper_cli();

    let mut child = std::process::Command::new(&cli)
        .arg("-osrt")
        .arg("-m")
        .arg(model_path)
        .arg("-f")
        .arg(input_path)
        .arg("-l")
        .arg(language)
        .arg("-ng")
        .arg("--prompt")
        .arg(prompt)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .expect("执行whisper-cli失败");

    let stdout = child.stdout.take().unwrap();
    // 创建一个线程来处理输出
    let (sx, rx) = flume::bounded(1);
    std::thread::spawn(move || {
        let reader = std::io::BufReader::new(stdout);
        for line in reader
            .lines()
            .flatten()
            .map(|v| parse_srt_line(&v))
            .flatten()
        {
            sx.send(line).unwrap();
        }
    });

    while let Ok(r) = rx.recv() {
        dbg!(r);
    }

    let output = child.wait()?;
    Ok(())
}

fn parse_srt_line(line: &str) -> Option<(String, String, String)> {
    if !line.starts_with('[') {
        return None;
    }

    let parts: Vec<&str> = line.splitn(2, ']').collect();
    if parts.len() != 2 {
        return None;
    }

    let time_parts: Vec<&str> = parts[0].trim_start_matches('[').split(" --> ").collect();
    if time_parts.len() != 2 {
        return None;
    }

    Some((
        time_parts[0].to_string(),
        time_parts[1].to_string(),
        parts[1].trim().to_string(),
    ))
}
