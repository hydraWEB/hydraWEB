import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import styled from '@emotion/styled/macro'
import { jsx, css, Global, keyframes } from '@emotion/react/macro'

export default function LinkButton({
                                       children,
                                       isLightOn,
                                       className,
                                       onClick,
                                       link,
                                       text,
                                       icon,

                                       textColor,
                                       iconColor,
                                       backgroundColor,
                                       textHoverColor,
                                       iconHoverColor,
                                       backgroundHoverColor,
                                       textActiveColor,
                                       iconActiveColor,
                                       backgroundActiveColor,

                                       textLightColor,
                                       iconLightColor,
                                       backgroundLightColor,
                                       textLightHoverColor,
                                       iconLightHoverColor,
                                       backgroundLightHoverColor,
                                       textLightActiveColor,
                                       iconLightActiveColor,
                                       backgroundLightActiveColor,
                                   }) {

    const ButtonText = styled.span(
        props => (
            {
                fontSize:"18px"
            }
        ))

    const IconWrapper = styled.div(
        props => (
            {
                marginRight: text ? "10px" : "0px",
                width: '18px',
            }
        ))

    const buttonStyle = props => ({
        marginTop: "3px",
        marginBottom: "3px",
        position: "relative",
        borderRadius: "4px",
        display: "flex",
        height: "42px",
        flexDirection: "row",
        alignItems: 'center',
        outline: 'none',
        padding: '8px 14px 8px 14px',
    })


    const ButtonWrapper = styled.div(
        props => (
            {
                display: 'inline-block',
                width:"100%"
            }
        )
    )



    const Btn = styled.div(
        buttonStyle,
        props => (
            !isLightOn && {
                backgroundColor: backgroundColor ? backgroundColor : "transparent",
                [ButtonText]: {
                    color: textColor ? textColor : "#A0A0A0"
                },
                [IconWrapper]: {
                    color: iconColor ? iconColor : "white"
                },
                '&:hover': {
                    backgroundColor: backgroundHoverColor ? backgroundHoverColor : "transparent",
                    outline: 'none',
                    [ButtonText]: {
                        color: textHoverColor ? textHoverColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconHoverColor ? iconHoverColor : "#92a4e4",
                    }
                },
                '&:active': {
                    backgroundColor: backgroundActiveColor ? backgroundActiveColor : "transparent",
                    outline: 'none',
                    [ButtonText]: {
                        color: textActiveColor ? textActiveColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconActiveColor ? iconActiveColor : "#92a4e4",
                    }
                }
            }

            || isLightOn && {
                backgroundColor: backgroundLightColor ? backgroundLightColor : "#ffa200",
                [ButtonText]: {
                    color: textLightColor ? textLightColor : "#FAFAFA"
                },
                [IconWrapper]: {
                    color: iconLightColor ? iconLightColor : "#92a4e4"
                },
                '&:hover': {
                    backgroundColor: backgroundLightHoverColor ? backgroundLightHoverColor : "#fa200",
                    outline: 'none',
                    [ButtonText]: {
                        color: textLightHoverColor ? textLightHoverColor : "#FAFAFA",
                    },
                    [IconWrapper]: {
                        color: iconLightHoverColor ? iconLightHoverColor : "#92a4e4",
                    }
                },
                '&:active': {
                    backgroundColor: backgroundLightActiveColor ? backgroundLightActiveColor : "transparent",
                    outline: 'none',
                    [ButtonText]: {
                        color: textLightActiveColor ? textLightActiveColor : "#92a4e4",
                    },
                    [IconWrapper]: {
                        color: iconLightActiveColor ? iconLightActiveColor : "#92a4e4",
                    }
                }
            }


        ))

    return (
        <>
            <div className={className}>
                <ButtonWrapper>
                    {link != null &&
                    <Link to={link}>
                            <Btn onClick={onClick}>
                                { text &&
                                <ButtonText>{text}</ButtonText>
                                }
                            </Btn>
                    </Link>
                    }
                </ButtonWrapper>
            </div>
        </>
    )
}