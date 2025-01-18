use std::{io::BufRead, process::ExitStatus};

use anyhow::{Context, Result};
use ffmpeg_sidecar::command::FfmpegCommand;
pub fn divide_audio(input: &str, output: &str) -> Result<()> {
    let status = FfmpegCommand::new()
        .input(input)
        .no_video()
        .codec_audio("pcm_s16le")
        .args(format!("-ar 16000 -ac 2").split(" "))
        .output(output)
        .spawn()?
        .wait()?;

    if status.success() {
        println!("FFmpeg exited with success.");
    } else {
        println!("FFmpeg exited with failure.");
    }
    Ok(())
}

pub fn get_duration(input: &str) -> Result<f64> {
    let reader = hound::WavReader::open(input)?;
    let spec = reader.spec();
    let duration = reader.duration() as f64 / spec.sample_rate as f64;
    Ok(duration)
}

pub fn whisper_command(
    model_path: &str,
    input_path: &str,
    language: &str,
    prompt: &str,
) -> Result<std::process::Child> {
    let cli = crate::extension::whisper_cli();
    let child = std::process::Command::new(&cli)
        .arg("-oj")
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
        .context("执行whisper-cli失败")?;

    // let stdout = child.stdout.take().unwrap();
    // // 创建一个线程来处理输出
    // // let (sx, rx) = flume::bounded(1);
    // std::thread::spawn(move || {
    //     let reader = std::io::BufReader::new(stdout);
    //     for line in reader
    //         .lines()
    //         .flatten()
    //         .map(|v| parse_srt_line(&v))
    //         .flatten()
    //     {
    //         sx.send(line).unwrap();
    //     }
    // });

    // // 等待子进程完成
    // child.wait().context("whisper-cli执行失败")

    Ok(child)
}

pub fn parse_srt_line(line: &str) -> Option<(String, String, String)> {
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
