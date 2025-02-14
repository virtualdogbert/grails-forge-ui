import React, { useMemo, useState } from 'react'
import { Icon, Row, Col, Button } from 'react-materialize'
import Modal from 'react-materialize/lib/Modal'
import { useStarterForm } from '../../state/store'
import { guessOs, osOpts, OS_WINDOWS, OS_NIX } from '../../utility'
import CopyToClipboard from '../CopyToClipboard'

const guessedOs = guessOs()
const sortedOsOpts = osOpts.sort((a, b) => {
  return a.value === guessedOs
    ? -1
    : b.value === guessedOs
    ? 0
    : a.value > b.value
    ? 0
    : -1
})

const NextSteps = ({ info, theme = 'light', onClose, onStartOver }) => {
  const { name, build } = useStarterForm()
  const { htmlUrl, cloneUrl } = info
  const [os, setOs] = useState(guessedOs)

  const unpackCommand = useMemo(() => {
    switch (info.type.toLowerCase()) {
      case 'clone':
        const all = `git clone ${cloneUrl}`
        const cmd = { [OS_NIX]: all, [OS_WINDOWS]: all }
        return { action: 'Clone the repo', cmd }
      case 'zip':
        const nix = `unzip ${name}.zip`
        const unzip = { [OS_NIX]: nix }
        return { action: 'Unzip the archive', cmd: unzip }
      default:
        return null
    }
  }, [info.type, cloneUrl, name])

  const cdCommand = useMemo(() => {
    const cd = `cd ${name}`
    return {
      action: 'cd into the project',
      cmd: {
        [OS_NIX]: cd,
        [OS_WINDOWS]: cd,
      },
    }
  }, [name])

  const launchCommand = useMemo(() => {
    const cmd = { action: 'Run Application!' }
    const tool = build.toLowerCase()
    switch (tool) {
      case 'maven':
        cmd.cmd = {
          [OS_NIX]: `./mvnw mn:run`,
          [OS_WINDOWS]: 'mvnw mn:run',
        }
        break
      case 'gradle':
      case 'gradle_kotlin':
      default:
        cmd.cmd = {
          [OS_NIX]: './gradlew bootRun',
          [OS_WINDOWS]: 'gradlew bootRun',
        }
        break
    }
    return cmd
  }, [build])

  return (
    <Modal
      open={info.show}
      options={{ onCloseEnd: onClose }}
      header="Your Grails app is ready for takeoff."
      className={`modal-lg ${theme} next-steps`}
      actions={[
        <Button waves="light" modal="close" flat>
          Close
        </Button>,
        <Button waves="light" onClick={onStartOver} flat>
          Start Over
        </Button>,
      ]}
    >
      <div className="os-select-opt-row">
        {sortedOsOpts.map((anOs) => (
          <div key={anOs.value} className="os-select-opt-col">
            <span
              className={['os-select', anOs.value === os && 'active'].join(' ')}
              role="button"
              onClick={() => setOs(anOs.value)}
            >
              {anOs.label}
            </span>
          </div>
        ))}
      </div>

      {htmlUrl && (
        <div className="next-steps-wrapper">
          <h5 className="heading">View your new repo on GitHub</h5>
          <Row className="next-steps-row">
            <Col className="text">{htmlUrl}</Col>
            <Col className="icon">
              <a target="_blank" rel="noopener noreferrer" href={htmlUrl}>
                <Icon>link</Icon>
              </a>
            </Col>
          </Row>
        </div>
      )}

      {unpackCommand && (
        <div className="next-steps-wrapper">
          <h5 className="heading">{unpackCommand.action}</h5>
          {unpackCommand.cmd[os] && (
            <Row className="next-steps-row">
              <Col className="text">{unpackCommand.cmd[os]}</Col>
              <Col className="icon">
                <CopyToClipboard value={unpackCommand.cmd[os]} />
              </Col>
            </Row>
          )}
        </div>
      )}

      <div className="next-steps-wrapper">
        <h5 className="heading">cd into the project</h5>
        <Row className="next-steps-row">
          <Col className="text">{cdCommand.cmd[os]}</Col>
          <Col className="icon">
            <CopyToClipboard value={cdCommand.cmd[os]} />
          </Col>
        </Row>
      </div>

      <div className="next-steps-wrapper">
        <h5 className="heading">{launchCommand.action}</h5>
        <Row className="next-steps-row">
          <Col className="text">{launchCommand.cmd[os]}</Col>
          <Col className="icon">
            <CopyToClipboard value={launchCommand.cmd[os]} />
          </Col>
        </Row>
      </div>

      <p className="info">
        Once you’ve gotten your new project started, you can continue your
        journey by reviewing our{' '}
        <a href="https://grails.org/documentation.html">documentation</a> and{' '}
        <a href="https://guides.grails.org/index.html">Grails Guides</a>
      </p>
    </Modal>
  )
}

export default NextSteps
