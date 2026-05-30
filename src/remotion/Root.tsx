import { Composition } from 'remotion'
import { SystemsLoopVideo } from './SystemsLoopVideo'

export const RemotionRoot = () => {
  return (
    <Composition
      id="StephenMantleLoop"
      component={SystemsLoopVideo}
      durationInFrames={360}
      fps={30}
      width={1280}
      height={960}
    />
  )
}
