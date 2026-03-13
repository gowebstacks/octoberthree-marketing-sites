'use client'

import { useState, type FC } from 'react'
import { storyblokEditable, type SbBlokData } from '@storyblok/react'
import { VideoPlayButton } from '../../atoms'
import { twMerge } from 'tailwind-merge'

export interface VideoBlok extends SbBlokData {
  title?: string
  videoType?: 'youtube' | 'wistia' | 'selfHosted'
  youtubeUrl?: string
  wistiaUrl?: string
  videoFile?: {
    filename?: string
    alt?: string
  }
  thumbnail?: {
    filename?: string
    alt?: string
  }
  autoPlay?: boolean
  classname?: string
}

const getVideoUrl = (blok: VideoBlok): string | null => {
  if (blok.videoType === 'youtube' && blok.youtubeUrl) {
    const match = blok.youtubeUrl.match(
      /(?:youtube\.com\/(?:.*v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )

    const id = match?.[1]
    if (!id) return null

    return `https://www.youtube.com/embed/${id}?autoplay=${blok.autoPlay ? 1 : 0}&mute=1&playlist=${id}`
  }

  if (blok.videoType === 'wistia' && blok.wistiaUrl) {
    const match = blok.wistiaUrl.match(
      /\/medias\/([a-zA-Z0-9_-]+)|embed\/iframe\/([a-zA-Z0-9_-]+)/
    )

    const id = match?.[1] || match?.[2]
    if (!id) return null

    return `https://fast.wistia.net/embed/iframe/${id}?autoPlay=${blok.autoPlay ? 'true' : 'false'}&muted=true`
  }

  if (blok.videoType === 'selfHosted' && blok.videoFile?.filename) {
    return blok.videoFile.filename
  }

  return null
}

export const Video: FC<{ blok: VideoBlok }> = ({ blok }) => {
  const { thumbnail, autoPlay = false, title, classname, videoType } = blok

  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const videoUrl = getVideoUrl(blok)
  if (!videoUrl) return null

  const isEmbed = videoType === 'youtube' || videoType === 'wistia'

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        'relative aspect-video bg-(--surface-background) border border-(--stroke-primary)',
        classname
      )}
    >
      {!isPlaying && thumbnail?.filename && (
        <img
          src={thumbnail.filename}
          alt={thumbnail.alt ?? 'Video thumbnail'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {!isPlaying && (
        <div
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label="Play video"
        >
          <VideoPlayButton />
        </div>
      )}

      {isPlaying &&
        (isEmbed ? (
          <iframe
            src={videoUrl}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            title={title || 'Video player'}
          />
        ) : (
          <video
            src={videoUrl}
            className="absolute inset-0 h-full w-full"
            controls
            autoPlay={autoPlay}
            playsInline
            muted={autoPlay}
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        ))}
    </div>
  )
}